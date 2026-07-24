import {
  ContributionCalendar,
  RepoSummary,
  UserProfile,
  UserSuggestion,
} from '@/types/user';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export class ProfileFetchError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = 'ProfileFetchError';
  }
}

// Calls our backend endpoint, which talks to GitHub
export async function fetchProfile(username: string): Promise<UserProfile> {
  const trimmed = username.trim();

  let response: Response;
  try {
    response = await fetch(`${API_URL}/user/${encodeURIComponent(trimmed)}`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
  } catch {
    throw new ProfileFetchError(
      'Could not reach the backend. Is the API running?',
      0,
    );
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = (await response.json()) as { message?: string };
      if (body?.message) {
        message = body.message;
      }
    } catch {
      // no JSON body, keep the default message
    }
    throw new ProfileFetchError(message, response.status);
  }

  return (await response.json()) as UserProfile;
}

// Autocomplete suggestions from our backend (GET /user?q=...)
export async function searchUsers(
  query: string,
  signal?: AbortSignal,
): Promise<UserSuggestion[]> {
  const q = query.trim();
  if (!q) {
    return [];
  }

  try {
    const response = await fetch(`${API_URL}/user?q=${encodeURIComponent(q)}`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
      signal,
    });
    if (!response.ok) {
      return [];
    }
    return (await response.json()) as UserSuggestion[];
  } catch {
    // network error or aborted request: just show no suggestions
    return [];
  }
}

async function getJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!response.ok) {
      return fallback;
    }
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export function fetchRepos(username: string): Promise<RepoSummary[]> {
  return getJson<RepoSummary[]>(
    `/user/${encodeURIComponent(username)}/repos`,
    [],
  );
}

export function fetchStarred(username: string): Promise<RepoSummary[]> {
  return getJson<RepoSummary[]>(
    `/user/${encodeURIComponent(username)}/starred`,
    [],
  );
}

export function fetchContributions(
  username: string,
): Promise<ContributionCalendar> {
  return getJson<ContributionCalendar>(
    `/user/${encodeURIComponent(username)}/contributions`,
    { totalContributions: 0, weeks: [] },
  );
}
