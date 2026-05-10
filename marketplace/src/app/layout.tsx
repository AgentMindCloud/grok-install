import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'grok-install marketplace',
  description: 'The Grok-native agent ecosystem catalog.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-white/10 px-6 py-4 flex items-baseline gap-3">
          <a href="/" className="text-primary font-mono text-xl">
            grok-install
          </a>
          <span className="text-white/50 text-sm">marketplace</span>
        </header>
        <main className="px-6 py-8 max-w-6xl mx-auto">{children}</main>
        <footer className="border-t border-white/10 px-6 py-4 text-white/50 text-sm text-center">
          Catalog generated at build time from{' '}
          <code className="font-mono">grok-install list-agents --json</code>.
        </footer>
      </body>
    </html>
  );
}
