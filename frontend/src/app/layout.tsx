import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GitHub Profile Viewer',
  description: "Look up a GitHub user's public profile.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-canvas-default font-sans text-fg-default antialiased">
        {children}
      </body>
    </html>
  );
}
