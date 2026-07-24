// Fields we use from GitHub's GET /users/:username response
export interface GithubApiUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  login: string;
  id: number;
  name: string | null;
  avatarUrl: string;
  htmlUrl: string;
  bio: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  twitterUsername: string | null;
  publicRepos: number;
  publicGists: number;
  followers: number;
  following: number;
  createdAt: string;
  updatedAt: string;
}

// GitHub GET /search/users response (only the fields we use)
export interface GithubSearchResponse {
  items: Array<{
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
  }>;
}

export interface UserSuggestion {
  login: string;
  avatarUrl: string;
  htmlUrl: string;
}
