'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, Calendar, Plus } from 'lucide-react';
import { cn } from '@/utils';
import HomeIcon from '@/components/ui/home-icon';
import MagnifierIcon from '@/components/ui/magnifier-icon';
import { AnimatedIconHandle } from '@/components/ui/types';

type NavItem = {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isMain?: boolean;
};

type NavItemWithAnimationProps = {
  href: string;
  isActive: boolean;
  Icon: React.ComponentType<{ className?: string; ref?: React.Ref<AnimatedIconHandle> }>;
  label: string;
  isAnimated: boolean;
};

function NavItemWithAnimation({ href, isActive, Icon, label, isAnimated }: NavItemWithAnimationProps) {
  const iconRef = useRef<AnimatedIconHandle>(null);

  const handleMouseEnter = () => {
    if (isAnimated && iconRef.current) {
      iconRef.current.startAnimation();
    }
  };

  const handleMouseLeave = () => {
    if (isAnimated && iconRef.current) {
      iconRef.current.stopAnimation();
    }
  };

  return (
    <Link
      href={href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'flex flex-col items-center justify-center gap-1 w-full h-full pointer-events-auto group transition-all duration-300 ease-out',
        isActive
          ? 'text-primary'
          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50 active:bg-accent/60'
      )}
    >
      {isAnimated ? (
        <Icon
          ref={iconRef}
          className="h-5 w-5"
        />
      ) : (
        <Icon className={cn(
          'h-5 w-5 transition-all duration-300',
          isActive
            ? 'scale-110'
            : 'group-hover:scale-110 group-hover:rotate-6'
        )} />
      )}
      <span className={cn(
        'text-[9px] font-semibold uppercase tracking-wide transition-all duration-300',
        isActive && 'scale-105 font-bold'
      )}>
        {label}
      </span>
    </Link>
  );
}

const navItems: NavItem[] = [
  { href: '/', icon: HomeIcon, label: 'Home' },
  { href: '/applications', icon: Briefcase, label: 'Jobs' },
  { href: '/add', icon: Plus, label: 'Add', isMain: true },
  { href: '/search', icon: MagnifierIcon, label: 'Search' },
  { href: '/calendar', icon: Calendar, label: 'Calendar' },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-2 pt-2 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none">
      <div className="relative bg-background/95 dark:bg-card/95 backdrop-blur-xl h-16 shadow-2xl dark:shadow-2xl border border-border/60 dark:border-border overflow-visible pointer-events-auto rounded-3xl">
        {/* Curved cut-out overlay - light mode */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-7 pointer-events-none z-1 dark:hidden"
          style={{
            background: 'radial-gradient(ellipse 40px 14px at 50% 0%, transparent 70%, hsl(var(--background)) 70%)',
          }}
        />
        {/* Curved cut-out overlay - dark mode */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-7 pointer-events-none z-1 hidden dark:block"
          style={{
            background: 'radial-gradient(ellipse 40px 14px at 50% 0%, transparent 70%, hsl(var(--card)) 70%)',
          }}
        />

        {/* Navigation items container */}
        <div className="relative grid grid-cols-5 items-center justify-items-center h-full px-1 gap-0" style={{ zIndex: 10 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const href = item.href;

            // Handle main button
            if (item.isMain) {
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex flex-col items-center justify-center relative w-full h-full z-10 group"
                >
                  <div className="relative w-16 h-16 gradient-bg rounded-full flex items-center justify-center shadow-xl glow-primary border-[3px] border-background -mt-8 mb-1 mx-auto pointer-events-auto transition-transform duration-300 ease-out hover:scale-110 hover:shadow-2xl hover:shadow-primary/50 active:scale-100">
                    {/* Subtle pulsing glow effect on hover */}
                    <div className="absolute inset-0 rounded-full bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />

                    <Icon className="relative z-10 h-6 w-6 text-white transition-transform duration-300 ease-out group-hover:rotate-90" />
                  </div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide transition-all duration-300 group-hover:text-primary group-hover:scale-105 text-center">
                    {item.label}
                  </span>
                </Link>
              );
            }

            // Handle regular nav items
            const itemPath = href.split('?')[0];
            const isActive = pathname === itemPath || pathname === href;

            // Check if icon is animated (has startAnimation method)
            const isAnimatedIcon = Icon === HomeIcon || Icon === MagnifierIcon;

            return (
              <NavItemWithAnimation
                key={href}
                href={href}
                isActive={isActive}
                Icon={Icon}
                label={item.label}
                isAnimated={isAnimatedIcon}
              />
            );
          })}
        </div>
      </div>
    </nav>
  );
}
