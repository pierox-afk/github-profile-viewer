import {
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ContributionCalendar,
  ContributionDay,
  GithubApiUser,
  GithubRepo,
  GithubSearchResponse,
  RepoSummary,
  UserProfile,
  UserSuggestion,
} from './user.types';

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_GRAPHQL = 'https://api.github.com/graphql';

const CONTRIBUTION_LEVELS: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly config: ConfigService) {}

  private buildHeaders(): Record<string, string> {
    const token = this.config.get<string>('GITHUB_TOKEN');
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'github-profile-viewer',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }

  async getProfile(username: string): Promise<UserProfile> {
    const headers = this.buildHeaders();

    let response: Response;
    try {
      response = await fetch(
        `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}`,
        { headers },
      );
    } catch (error) {
      this.logger.error(`Failed to reach GitHub API: ${String(error)}`);
      throw new ServiceUnavailableException(
        'Could not reach the GitHub API. Please try again later.',
      );
    }

    if (response.status === 404) {
      throw new NotFoundException(`GitHub user "${username}" was not found.`);
    }

    if (response.status === 403 || response.status === 429) {
      throw new HttpException(
        'GitHub API rate limit exceeded. Add a GITHUB_TOKEN to raise the limit.',
        response.status,
      );
    }

    if (!response.ok) {
      this.logger.error(`Unexpected GitHub response: ${response.status}`);
      throw new ServiceUnavailableException(
        'Unexpected error while contacting the GitHub API.',
      );
    }

    const data = (await response.json()) as GithubApiUser;
    return this.toProfile(data);
  }

  private toProfile(user: GithubApiUser): UserProfile {
    return {
      login: user.login,
      id: user.id,
      name: user.name,
      avatarUrl: user.avatar_url,
      htmlUrl: user.html_url,
      bio: user.bio,
      company: user.company,
      blog: user.blog || null,
      location: user.location,
      email: user.email,
      twitterUsername: user.twitter_username,
      publicRepos: user.public_repos,
      publicGists: user.public_gists,
      followers: user.followers,
      following: user.following,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }

  async searchUsers(query: string): Promise<UserSuggestion[]> {
    const q = query.trim().slice(0, 100);
    if (!q) {
      return [];
    }

    let response: Response;
    try {
      response = await fetch(
        `${GITHUB_API_BASE}/search/users?q=${encodeURIComponent(q)}&per_page=7`,
        { headers: this.buildHeaders() },
      );
    } catch (error) {
      this.logger.error(`Failed to reach GitHub search API: ${String(error)}`);
      throw new ServiceUnavailableException(
        'Could not reach the GitHub API. Please try again later.',
      );
    }

    if (!response.ok) {
      // Search has a stricter rate limit; degrade gracefully to no suggestions
      this.logger.warn(`GitHub search returned ${response.status}`);
      return [];
    }

    const data = (await response.json()) as GithubSearchResponse;
    return data.items.map((item) => ({
      login: item.login,
      avatarUrl: item.avatar_url,
      htmlUrl: item.html_url,
    }));
  }

  async getRepos(username: string): Promise<RepoSummary[]> {
    return this.fetchRepoList(
      `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=30&type=owner`,
      username,
    );
  }

  async getStarred(username: string): Promise<RepoSummary[]> {
    return this.fetchRepoList(
      `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/starred?per_page=30`,
      username,
    );
  }

  private async fetchRepoList(
    url: string,
    username: string,
  ): Promise<RepoSummary[]> {
    let response: Response;
    try {
      response = await fetch(url, { headers: this.buildHeaders() });
    } catch (error) {
      this.logger.error(`Failed to reach GitHub API: ${String(error)}`);
      throw new ServiceUnavailableException(
        'Could not reach the GitHub API. Please try again later.',
      );
    }

    if (response.status === 404) {
      throw new NotFoundException(`GitHub user "${username}" was not found.`);
    }

    if (!response.ok) {
      this.logger.warn(`GitHub repos request returned ${response.status}`);
      return [];
    }

    const repos = (await response.json()) as GithubRepo[];
    return repos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      htmlUrl: repo.html_url,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      updatedAt: repo.updated_at,
      isFork: repo.fork,
    }));
  }

  async getContributions(username: string): Promise<ContributionCalendar> {
    const token = this.config.get<string>('GITHUB_TOKEN');
    // The contributions calendar is only available through the GraphQL API,
    // which requires authentication. Without a token we degrade gracefully.
    if (!token) {
      return { totalContributions: 0, weeks: [] };
    }

    const query = `
      query($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                  contributionLevel
                }
              }
            }
          }
        }
      }`;

    let response: Response;
    try {
      response = await fetch(GITHUB_GRAPHQL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'github-profile-viewer',
        },
        body: JSON.stringify({ query, variables: { login: username } }),
      });
    } catch (error) {
      this.logger.error(`Failed to reach GitHub GraphQL: ${String(error)}`);
      return { totalContributions: 0, weeks: [] };
    }

    if (!response.ok) {
      this.logger.warn(`GitHub GraphQL returned ${response.status}`);
      return { totalContributions: 0, weeks: [] };
    }

    const body = (await response.json()) as {
      data?: {
        user?: {
          contributionsCollection: {
            contributionCalendar: {
              totalContributions: number;
              weeks: Array<{
                contributionDays: Array<{
                  date: string;
                  contributionCount: number;
                  contributionLevel: string;
                }>;
              }>;
            };
          };
        } | null;
      };
    };

    const calendar = body.data?.user?.contributionsCollection.contributionCalendar;
    if (!calendar) {
      return { totalContributions: 0, weeks: [] };
    }

    const weeks: ContributionDay[][] = calendar.weeks.map((week) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
        level: CONTRIBUTION_LEVELS[day.contributionLevel] ?? 0,
      })),
    );

    return { totalContributions: calendar.totalContributions, weeks };
  }
}
