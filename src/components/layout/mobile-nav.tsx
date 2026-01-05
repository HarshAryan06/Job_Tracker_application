'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, Briefcase, Plus, Search, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SearchModal } from '@/components/features/search-modal';

type NavItemWithHref = {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isMain?: boolean;
  isSearch?: never;
};

type NavItemSearch = {
  href?: never;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isMain?: never;
  isSearch: true;
};

type NavItem = NavItemWithHref | NavItemSearch;

const navItems: NavItem[] = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/applications', icon: Briefcase, label: 'Apps' },
  { href: '/add', icon: Plus, label: 'Add', isMain: true },
  { icon: Search, label: 'Search', isSearch: true },
];

export function MobileNav() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none">
      <div className="bg-card/95 backdrop-blur-xl h-16 rounded-2xl grid grid-cols-5 items-stretch shadow-2xl border border-border overflow-visible px-2 pointer-events-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          // Handle search button (no href)
          if (item.isSearch) {
            return (
              <button
                key="search"
                onClick={() => setSearchOpen(true)}
                className="flex flex-col items-center justify-center gap-1 h-full rounded-xl pointer-events-auto group transition-all duration-300 ease-out text-muted-foreground hover:text-foreground hover:bg-accent/50 active:scale-95"
              >
                <Icon className="h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" />
                <span className="text-[9px] font-bold uppercase tracking-wide transition-all duration-300">
                  {item.label}
                </span>
              </button>
            );
          }
          
          // At this point, TypeScript knows item has href (discriminated union)
          const href = item.href;
          
          // Handle main button
          if (item.isMain) {
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center justify-center relative h-full z-10 group"
              >
                <div className="w-12 h-12 gradient-bg rounded-full flex items-center justify-center shadow-lg glow-primary border-4 border-background -mt-8 mb-1 pointer-events-auto transition-all duration-300 ease-out hover:scale-110 hover:shadow-xl hover:shadow-primary/50 active:scale-95 group-hover:rotate-12">
                  <Icon className="h-5 w-5 text-white transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide transition-colors duration-300 group-hover:text-primary">
                  {item.label}
                </span>
              </Link>
            );
          }
          
          // Handle regular nav items
          const itemPath = href.split('?')[0];
          const isActive = pathname === itemPath || pathname === href;
          
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 h-full rounded-xl pointer-events-auto group transition-all duration-300 ease-out',
                isActive 
                  ? 'text-primary gradient-bg-subtle scale-105' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50 active:scale-95'
              )}
            >
              <Icon className={cn(
                'h-5 w-5 transition-all duration-300',
                isActive 
                  ? 'scale-110' 
                  : 'group-hover:scale-110 group-hover:rotate-6'
              )} />
              <span className={cn(
                'text-[9px] font-bold uppercase tracking-wide transition-all duration-300',
                isActive && 'scale-105'
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
        
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center justify-center gap-1 h-full text-muted-foreground hover:bg-accent rounded-xl pointer-events-auto group transition-all duration-300 ease-out hover:text-foreground active:scale-95"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {mounted ? (
            <>
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-amber-400 transition-all duration-500 group-hover:scale-110 group-hover:rotate-180 group-active:scale-95" />
              ) : (
                <Moon className="h-5 w-5 text-primary transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-active:scale-95" />
              )}
              <span className="text-[9px] font-bold uppercase tracking-wide transition-all duration-300 group-hover:scale-105">
                {theme === 'dark' ? 'Light' : 'Dark'}
              </span>
            </>
          ) : (
            <>
              <Sun className="h-5 w-5 transition-all duration-300 group-hover:scale-110" />
              <span className="text-[9px] font-bold uppercase tracking-wide transition-all duration-300 group-hover:scale-105">
                Theme
              </span>
            </>
          )}
        </Button>
      </div>
      
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </nav>
  );
}
