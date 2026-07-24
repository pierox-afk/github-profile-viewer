import { UserProfile } from '@/types/user';

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
