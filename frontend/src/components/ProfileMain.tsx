'use client';

import { UserProfile } from '@/types/user';
import { BookIcon, CalendarIcon, PeopleIcon, RepoIcon } from './Icons';

interface ProfileMainProps {
  user: UserProfile;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const tabs = [
  { label: 'Overview', active: true, count: null as number | null },
  { label: 'Repositories', active: false, count: null as number | null },
  { label: 'Projects', active: false, count: null as number | null },
  { label: 'Packages', active: false, count: null as number | null },
  { label: 'Stars', active: false, count: null as number | null },
];

export function ProfileMain({ user }: ProfileMainProps) {
  const tabItems = tabs.map((tab) =>
    tab.label === 'Repositories'
      ? { ...tab, count: user.publicRepos }
      : tab,
  );

  const stats = [
    {
      label: 'Public repositories',
      value: user.publicRepos,
      icon: <RepoIcon />,
    },
    { label: 'Public gists', value: user.publicGists, icon: <BookIcon /> },
    { label: 'Followers', value: user.followers, icon: <PeopleIcon /> },
    { label: 'Following', value: user.following, icon: <PeopleIcon /> },
  ];

  return (
    <section className="w-full">
      <nav className="border-b border-border-default">
        <ul className="flex items-center gap-2 overflow-x-auto text-sm">
          {tabItems.map((tab) => (
            <li key={tab.label} className="pb-2">
              <span
                className={`inline-flex cursor-default items-center gap-2 rounded-md px-3 py-1.5 ${
                  tab.active
                    ? 'font-semibold text-fg-default'
                    : 'text-fg-muted hover:bg-canvas-subtle'
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className="rounded-full bg-canvas-subtle px-2 text-xs text-fg-muted">
                    {tab.count}
                  </span>
                )}
              </span>
              {tab.active && (
                <span className="mt-2 block h-0.5 rounded-full bg-[#f78166]" />
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-6">
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

        <h2 className="mb-3 mt-8 text-base font-semibold text-fg-default">
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

        <div className="mt-4 flex items-center gap-2 text-sm text-fg-muted">
          <CalendarIcon />
          Member since {formatDate(user.createdAt)}
        </div>
      </div>
    </section>
  );
}
