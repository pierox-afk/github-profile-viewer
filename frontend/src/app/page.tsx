'use client';

import { useCallback, useEffect, useState } from 'react';
import { TopBar } from '@/components/TopBar';
import { ProfileSidebar } from '@/components/ProfileSidebar';
import { ProfileMain } from '@/components/ProfileMain';
import { ErrorState, LoadingState } from '@/components/StateViews';
import { fetchProfile, ProfileFetchError } from '@/lib/api';
import { UserProfile } from '@/types/user';

const DEFAULT_USERNAME =
  process.env.NEXT_PUBLIC_DEFAULT_USERNAME ?? 'octocat';

type Status = 'loading' | 'success' | 'error';

export default function HomePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState('');

  const loadProfile = useCallback(async (username: string) => {
    setStatus('loading');
    setError('');
    try {
      const profile = await fetchProfile(username);
      setUser(profile);
      setStatus('success');
    } catch (err) {
      const message =
        err instanceof ProfileFetchError
          ? err.message
          : 'Unexpected error while loading the profile.';
      setError(message);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    void loadProfile(DEFAULT_USERNAME);
  }, [loadProfile]);

  return (
    <div className="min-h-screen">
      <TopBar onSearch={loadProfile} />

      <main className="mx-auto max-w-[1280px] px-4 py-8 md:px-8">
        {status === 'loading' && <LoadingState />}

        {status === 'error' && <ErrorState message={error} />}

        {status === 'success' && user && (
          <div className="md:flex md:gap-8">
            <ProfileSidebar user={user} />
            <div className="mt-8 w-full md:mt-0">
              <ProfileMain user={user} />
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border-default py-8 text-center text-xs text-fg-muted">
        © {new Date().getFullYear()} GitHub Profile Viewer
      </footer>
    </div>
  );
}
