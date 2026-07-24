'use client';

import { useEffect, useState } from 'react';
import {
  ContributionCalendar,
  RepoSummary,
  UserProfile,
} from '@/types/user';
import { fetchContributions, fetchRepos, fetchStarred } from '@/lib/api';
import { ContributionGraph } from './ContributionGraph';
import { RepoList } from './RepoList';
import {
  BookIcon,
  CalendarIcon,
  PeopleIcon,
  RepoIcon,
  StarIcon,
} from './Icons';

interface ProfileMainProps {
  user: UserProfile;
}

type Tab = 'Overview' | 'Repositories' | 'Stars';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function ProfileMain({ user }: ProfileMainProps) {
  const [tab, setTab] = useState<Tab>('Overview');
  const [contributions, setContributions] =
    useState<ContributionCalendar | null>(null);
  const [repos, setRepos] = useState<RepoSummary[] | null>(null);
  const [starred, setStarred] = useState<RepoSummary[] | null>(null);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [loadingStarred, setLoadingStarred] = useState(false);

  // Reset everything and load the contribution graph when the user changes
  useEffect(() => {
    setTab('Overview');
    setContributions(null);
    setRepos(null);
    setStarred(null);
    setLoadingRepos(false);
    setLoadingStarred(false);

    let active = true;
    fetchContributions(user.login).then((data) => {
      if (active) {
        setContributions(data);
      }
    });
    return () => {
      active = false;
    };
  }, [user.login]);

  // Lazy-load the list for the tab the user opens
  useEffect(() => {
    if (tab === 'Repositories' && repos === null && !loadingRepos) {
      setLoadingRepos(true);
      fetchRepos(user.login).then((data) => {
        setRepos(data);
        setLoadingRepos(false);
      });
    }
    if (tab === 'Stars' && starred === null && !loadingStarred) {
      setLoadingStarred(true);
      fetchStarred(user.login).then((data) => {
        setStarred(data);
        setLoadingStarred(false);
      });
    }
  }, [tab, user.login, repos, starred, loadingRepos, loadingStarred]);

  const tabs: { label: Tab; count?: number }[] = [
    { label: 'Overview' },
    { label: 'Repositories', count: user.publicRepos },
    { label: 'Stars' },
  ];

  const stats = [
    { label: 'Public repositories', value: user.publicRepos, icon: <RepoIcon /> },
    { label: 'Public gists', value: user.publicGists, icon: <BookIcon /> },
    { label: 'Followers', value: user.followers, icon: <PeopleIcon /> },
    { label: 'Following', value: user.following, icon: <PeopleIcon /> },
  ];

  return (
    <section className="w-full">
      <nav className="border-b border-border-default">
        <ul className="flex items-center gap-1 overflow-x-auto text-sm">
          {tabs.map((item) => {
            const active = item.label === tab;
            return (
              <li key={item.label} className="pb-2">
                <button
                  type="button"
                  onClick={() => setTab(item.label)}
                  className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 ${
                    active
                      ? 'font-semibold text-fg-default'
                      : 'text-fg-muted hover:bg-canvas-subtle'
                  }`}
                >
                  {item.label === 'Stars' && <StarIcon width={14} height={14} />}
                  {item.label}
                  {item.count !== undefined && (
                    <span className="rounded-full bg-canvas-subtle px-2 text-xs text-fg-muted">
                      {item.count}
                    </span>
                  )}
                </button>
                {active && (
                  <span className="mt-2 block h-0.5 rounded-full bg-[#f78166]" />
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-6">
        {tab === 'Overview' && (
          <div className="space-y-8">
            <div className="rounded-md border border-border-default">
              <div className="flex items-center gap-2 border-b border-border-default bg-canvas-subtle px-4 py-3 text-sm font-semibold text-fg-default">
                <BookIcon />
                {user.login}
                <span className="rounded-full border border-border-default px-2 text-xs font-normal text-fg-muted">
                  Public
                </span>
              </div>
              <div className="px-4 py-5 text-sm text-fg-muted">
                {user.bio ? (
                  <p className="text-fg-default">{user.bio}</p>
                ) : (
                  <p>{user.name ?? user.login} hasn&apos;t written a bio yet.</p>
                )}
              </div>
            </div>

            {contributions === null ? (
              <div className="h-36 animate-pulse rounded-md border border-border-default bg-canvas-subtle" />
            ) : (
              contributions.weeks.length > 0 && (
                <ContributionGraph data={contributions} />
              )
            )}

            <div>
              <h2 className="mb-3 text-base font-semibold text-fg-default">
                Profile stats
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-md border border-border-default bg-canvas-subtle p-4"
                  >
                    <div className="flex items-center gap-2 text-fg-muted">
                      {stat.icon}
                      <span className="text-xs">{stat.label}</span>
                    </div>
                    <p className="mt-2 text-2xl font-semibold text-fg-default">
                      {stat.value.toLocaleString('en-US')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-fg-muted">
              <CalendarIcon />
              Member since {formatDate(user.createdAt)}
            </div>
          </div>
        )}

        {tab === 'Repositories' && (
          <RepoList
            repos={repos ?? []}
            loading={loadingRepos || repos === null}
            emptyMessage={`${user.login} doesn't have any public repositories yet.`}
          />
        )}

        {tab === 'Stars' && (
          <RepoList
            repos={starred ?? []}
            loading={loadingStarred || starred === null}
            emptyMessage={`${user.login} hasn't starred any repositories yet.`}
          />
        )}
      </div>
    </section>
  );
}
