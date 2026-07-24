'use client';

import type { ReactElement } from 'react';
import Image from 'next/image';
import { UserProfile } from '@/types/user';
import {
  LinkIcon,
  LocationIcon,
  MailIcon,
  OrganizationIcon,
  PeopleIcon,
  XIcon,
} from './Icons';

interface ProfileSidebarProps {
  user: UserProfile;
}

function formatCount(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return String(value);
}

function normalizeUrl(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export function ProfileSidebar({ user }: ProfileSidebarProps) {
  const details = [
    user.company && {
      icon: <OrganizationIcon />,
      content: <span>{user.company}</span>,
      key: 'company',
    },
    user.location && {
      icon: <LocationIcon />,
      content: <span>{user.location}</span>,
      key: 'location',
    },
    user.email && {
      icon: <MailIcon />,
      content: (
        <a
          className="hover:text-accent-fg hover:underline"
          href={`mailto:${user.email}`}
        >
          {user.email}
        </a>
      ),
      key: 'email',
    },
    user.blog && {
      icon: <LinkIcon />,
      content: (
        <a
          className="truncate hover:text-accent-fg hover:underline"
          href={normalizeUrl(user.blog)}
          target="_blank"
          rel="noreferrer noopener"
        >
          {user.blog}
        </a>
      ),
      key: 'blog',
    },
    user.twitterUsername && {
      icon: <XIcon />,
      content: (
        <a
          className="hover:text-accent-fg hover:underline"
          href={`https://twitter.com/${user.twitterUsername}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          @{user.twitterUsername}
        </a>
      ),
      key: 'twitter',
    },
  ].filter(Boolean) as {
    icon: ReactElement;
    content: ReactElement;
    key: string;
  }[];

  return (
    <aside className="w-full md:w-[296px] md:shrink-0">
      <div className="-mt-6 md:mt-[-40px]">
        <Image
          src={user.avatarUrl}
          alt={`${user.login} avatar`}
          width={296}
          height={296}
          priority
          className="h-40 w-40 rounded-full border border-border-default bg-canvas-subtle md:h-[260px] md:w-[260px]"
        />
      </div>

      <div className="mt-4">
        <h1 className="text-2xl font-semibold leading-tight text-fg-default">
          {user.name ?? user.login}
        </h1>
        <p className="text-xl font-light text-fg-muted">{user.login}</p>
      </div>

      {user.bio && (
        <p className="mt-4 text-base text-fg-default">{user.bio}</p>
      )}

      <a
        href={user.htmlUrl}
        target="_blank"
        rel="noreferrer noopener"
        className="mt-4 flex w-full items-center justify-center rounded-md border border-btn-border bg-btn-bg px-3 py-[5px] text-sm font-medium text-fg-default transition-colors hover:bg-btn-hover"
      >
        View on GitHub
      </a>

      <div className="mt-4 flex items-center gap-1 text-sm text-fg-muted">
        <PeopleIcon />
        <a
          href={`${user.htmlUrl}?tab=followers`}
          target="_blank"
          rel="noreferrer noopener"
          className="group inline-flex items-center gap-1 hover:text-accent-fg"
        >
          <span className="font-semibold text-fg-default group-hover:text-accent-fg">
            {formatCount(user.followers)}
          </span>
          followers
        </a>
        <span aria-hidden>·</span>
        <a
          href={`${user.htmlUrl}?tab=following`}
          target="_blank"
          rel="noreferrer noopener"
          className="group inline-flex items-center gap-1 hover:text-accent-fg"
        >
          <span className="font-semibold text-fg-default group-hover:text-accent-fg">
            {formatCount(user.following)}
          </span>
          following
        </a>
      </div>

      {details.length > 0 && (
        <ul className="mt-4 space-y-2 text-sm text-fg-default">
          {details.map((item) => (
            <li key={item.key} className="flex items-center gap-2">
              <span className="text-fg-muted">{item.icon}</span>
              {item.content}
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
