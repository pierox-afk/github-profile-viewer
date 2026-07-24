import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { GithubApiUser } from './user.types';

describe('UserService', () => {
  let service: UserService;
  const configGet = jest.fn().mockReturnValue(undefined);

  beforeEach(() => {
    service = new UserService({ get: configGet } as unknown as ConfigService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const githubUser: GithubApiUser = {
    login: 'octocat',
    id: 583231,
    avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
    html_url: 'https://github.com/octocat',
    name: 'The Octocat',
    company: '@github',
    blog: 'https://github.blog',
    location: 'San Francisco',
    email: null,
    bio: 'A friendly cat',
    twitter_username: null,
    public_repos: 8,
    public_gists: 8,
    followers: 10000,
    following: 9,
    created_at: '2011-01-25T18:44:36Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  it('maps the GitHub API response into a normalized profile', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => githubUser,
    }) as unknown as typeof fetch;

    const profile = await service.getProfile('octocat');

    expect(profile.login).toBe('octocat');
    expect(profile.name).toBe('The Octocat');
    expect(profile.avatarUrl).toBe(githubUser.avatar_url);
    expect(profile.publicRepos).toBe(8);
    expect(profile.followers).toBe(10000);
  });

  it('throws NotFoundException when GitHub returns 404', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({}),
    }) as unknown as typeof fetch;

    await expect(service.getProfile('does-not-exist')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
