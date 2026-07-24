'use client';

import { FormEvent, useState } from 'react';
import { MarkGithubIcon, SearchIcon } from './Icons';

interface TopBarProps {
  onSearch: (username: string) => void;
}

export function TopBar({ onSearch }: TopBarProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  };

  return (
    <header className="sticky top-0 z-10 border-b border-border-default bg-canvas-inset">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-4 px-4 md:px-8">
        <a
          href="https://github.com"
          className="text-fg-default transition-colors hover:text-fg-muted"
          aria-label="GitHub home"
        >
          <MarkGithubIcon />
        </a>

        <form onSubmit={handleSubmit} className="relative w-full max-w-sm">
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-fg-muted">
            <SearchIcon />
          </span>
          <input
            type="text"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Search a GitHub username…"
            aria-label="Search a GitHub username"
            className="h-8 w-full rounded-md border border-border-default bg-canvas-subtle pl-9 pr-3 text-sm text-fg-default placeholder:text-fg-muted focus:border-accent-fg focus:outline-none focus:ring-1 focus:ring-accent-fg"
          />
        </form>

        <div className="ml-auto hidden items-center gap-3 text-sm text-fg-default md:flex">
          <span className="cursor-default rounded-md px-2 py-1 hover:text-fg-muted">
            Pull requests
          </span>
          <span className="cursor-default rounded-md px-2 py-1 hover:text-fg-muted">
            Issues
          </span>
          <span className="cursor-default rounded-md px-2 py-1 hover:text-fg-muted">
            Marketplace
          </span>
        </div>
      </div>
    </header>
  );
}
