'use client';

import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sun } from 'lucide-react';
import { cn } from '@/utils';
import { Logo } from './logo';
import { GitHubStarButton } from '@/components/features/github-star-button';
import MoonIcon from '@/components/ui/moon-icon';

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/applications', label: 'Applications' },
  { href: '/add', label: 'Add New' },
];

export function Header() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-[72px] sm:h-20">
        <Link href="/" className="cursor-pointer group">
          <div className="group-hover:scale-105 transition-transform duration-300">
            <Logo size="md" showText hideIcon className="sm:hidden" />
            <Logo size="lg" showText hideIcon className="hidden sm:flex" />
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    'relative px-5 py-2.5 text-sm font-semibold transition-all',
                    isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[2.5px] gradient-bg rounded-full" />
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <GitHubStarButton />
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border/50 bg-card/50 hover:bg-card/80 active:scale-95 transition-all duration-200 flex items-center justify-center group touch-manipulation"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 sm:h-5 sm:w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-muted-foreground group-hover:text-foreground" />
            <div className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100">
              <MoonIcon size={16} color="currentColor" className="text-muted-foreground group-hover:text-foreground" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}

