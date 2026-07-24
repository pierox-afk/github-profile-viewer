import { MarkGithubIcon } from './Icons';

export function LoadingState() {
  return (
    <div className="animate-pulse md:flex md:gap-8">
      <div className="w-full md:w-[296px] md:shrink-0">
        <div className="h-40 w-40 rounded-full bg-canvas-subtle md:h-[260px] md:w-[260px]" />
        <div className="mt-4 h-6 w-40 rounded bg-canvas-subtle" />
        <div className="mt-2 h-5 w-28 rounded bg-canvas-subtle" />
        <div className="mt-4 h-9 w-full rounded-md bg-canvas-subtle" />
      </div>
      <div className="mt-8 w-full md:mt-0">
        <div className="h-8 w-full rounded bg-canvas-subtle" />
        <div className="mt-6 h-32 w-full rounded-md bg-canvas-subtle" />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-24 rounded-md bg-canvas-subtle" />
          ))}
        </div>
      </div>
    </div>
  );
}

interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-md border border-border-default bg-canvas-subtle px-6 py-12 text-center">
      <span className="text-fg-muted">
        <MarkGithubIcon />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-fg-default">
        Something went wrong
      </h2>
      <p className="mt-2 text-sm text-fg-muted">{message}</p>
    </div>
  );
}
