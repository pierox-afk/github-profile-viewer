'use client';

import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';
import { searchUsers } from '@/lib/api';
import { UserSuggestion } from '@/types/user';
import { MarkGithubIcon, SearchIcon } from './Icons';

interface TopBarProps {
  onSearch: (username: string) => void;
}

export function TopBar({ onSearch }: TopBarProps) {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced fetch of suggestions as the user types
  useEffect(() => {
    const query = value.trim();
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      const results = await searchUsers(query, controller.signal);
      setSuggestions(results);
      setActiveIndex(-1);
      setOpen(true);
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [value]);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const select = (login: string) => {
    setValue('');
    setSuggestions([]);
    setOpen(false);
    setActiveIndex(-1);
    onSearch(login);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      select(suggestions[activeIndex].login);
      return;
    }
    const trimmed = value.trim();
    if (trimmed) {
      select(trimmed);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) {
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border-default bg-canvas-inset">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-4 px-4 md:px-8">
        <a
          href="https://github.com"
          className="text-fg-default transition-colors hover:text-fg-muted"
          aria-label="GitHub home"
        >
          <MarkGithubIcon />
        </a>

        <div ref={containerRef} className="relative w-full max-w-sm">
          <form onSubmit={handleSubmit}>
            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-fg-muted">
              <SearchIcon />
            </span>
            <input
              type="text"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => suggestions.length > 0 && setOpen(true)}
              placeholder="Search a GitHub username…"
              aria-label="Search a GitHub username"
              autoComplete="off"
              className="h-8 w-full rounded-md border border-border-default bg-canvas-subtle pl-9 pr-3 text-sm text-fg-default placeholder:text-fg-muted focus:border-accent-fg focus:outline-none focus:ring-1 focus:ring-accent-fg"
            />
          </form>

          {open && suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 top-full mt-1 overflow-hidden rounded-md border border-border-default bg-canvas-subtle py-1 shadow-lg">
              {suggestions.map((user, index) => (
                <li key={user.login}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => select(user.login)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm ${
                      index === activeIndex
                        ? 'bg-accent-emphasis/20 text-fg-default'
                        : 'text-fg-default hover:bg-border-muted'
                    }`}
                  >
                    <Image
                      src={user.avatarUrl}
                      alt=""
                      width={20}
                      height={20}
                      className="h-5 w-5 rounded-full"
                    />
                    <span className="truncate">{user.login}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

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
