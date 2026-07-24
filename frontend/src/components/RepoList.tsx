'use client';

import { RepoSummary } from '@/types/user';
import { ForkIcon, RepoIcon, StarIcon } from './Icons';

interface RepoListProps {
  repos: RepoSummary[];
  loading: boolean;
  emptyMessage: string;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Vue: '#41b883',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function RepoSkeleton() {
  return (
    <div className="animate-pulse rounded-md border border-border-default p-4">
      <div className="h-4 w-40 rounded bg-canvas-subtle" />
      <div className="mt-3 h-3 w-full rounded bg-canvas-subtle" />
      <div className="mt-4 h-3 w-24 rounded bg-canvas-subtle" />
    </div>
  );
}

export function RepoList({ repos, loading, emptyMessage }: RepoListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <RepoSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (repos.length === 0) {
    return (
      <div className="rounded-md border border-border-default px-4 py-10 text-center text-sm text-fg-muted">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {repos.map((repo) => (
        <div
          key={repo.id}
          className="flex flex-col rounded-md border border-border-default p-4"
        >
          <div className="flex items-center gap-2">
            <RepoIcon />
            <a
              href={repo.htmlUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="truncate text-sm font-semibold text-accent-fg hover:underline"
            >
              {repo.name}
            </a>
            {repo.isFork && (
              <span className="rounded-full border border-border-default px-2 text-xs text-fg-muted">
                Fork
              </span>
            )}
          </div>

          {repo.description && (
            <p className="mt-2 line-clamp-2 text-sm text-fg-muted">
              {repo.description}
            </p>
          )}

          <div className="mt-auto flex items-center gap-4 pt-3 text-xs text-fg-muted">
            {repo.language && (
              <span className="flex items-center gap-1">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor:
                      LANGUAGE_COLORS[repo.language] ?? '#8b949e',
                  }}
                />
                {repo.language}
              </span>
            )}
            {repo.stars > 0 && (
              <span className="flex items-center gap-1">
                <StarIcon width={14} height={14} />
                {repo.stars.toLocaleString('en-US')}
              </span>
            )}
            {repo.forks > 0 && (
              <span className="flex items-center gap-1">
                <ForkIcon width={14} height={14} />
                {repo.forks.toLocaleString('en-US')}
              </span>
            )}
            <span>Updated {formatDate(repo.updatedAt)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
