'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'default' | 'icon-only';
  hideIcon?: boolean;
}

const sizeMap = {
  sm: { icon: 20, text: 'text-sm' },
  md: { icon: 28, text: 'text-base' },
  lg: { icon: 36, text: 'text-lg' },
};

export function Logo({ className, size = 'md', showText = true, variant = 'default', hideIcon = false }: LogoProps) {
  const iconSize = sizeMap[size].icon;
  const textSize = sizeMap[size].text;
  const [isDark, setIsDark] = useState(false);
  const [gradientId] = useState(() => `logoGradient-${Math.random().toString(36).slice(2, 11)}`);
  const [gradientIdDark] = useState(() => `logoGradientDark-${Math.random().toString(36).slice(2, 11)}`);

  useEffect(() => {
    // Check if dark mode is active
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  const logoIcon = (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="50%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
        <linearGradient id={gradientIdDark} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#fcd34d" />
        </linearGradient>
      </defs>
      
      <g transform="translate(20, 20)">
        {/* Briefcase body */}
        <rect
          x="-9"
          y="-5"
          width="18"
          height="12"
          rx="2"
          fill={isDark ? `url(#${gradientIdDark})` : `url(#${gradientId})`}
        />
        
        {/* Briefcase handle */}
        <path
          d="M -7 -5 L -7 -7.5 Q -7 -9 -4.5 -9 L 4.5 -9 Q 7 -9 7 -7.5 L 7 -5"
          fill="none"
          stroke={isDark ? `url(#${gradientIdDark})` : `url(#${gradientId})`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Briefcase divider */}
        <line
          x1="-9"
          y1="2"
          x2="9"
          y2="2"
          stroke={isDark ? `url(#${gradientIdDark})` : `url(#${gradientId})`}
          strokeWidth="1.5"
          opacity="0.4"
        />
        
        {/* Lock emblem */}
        <circle
          cx="0"
          cy="-1"
          r="4"
          fill="none"
          stroke={isDark ? `url(#${gradientIdDark})` : `url(#${gradientId})`}
          strokeWidth="1.5"
          opacity="0.5"
        />
        
        {/* Center dot */}
        <circle
          cx="0"
          cy="-1"
          r="1.5"
          fill={isDark ? `url(#${gradientIdDark})` : `url(#${gradientId})`}
        />
        
        {/* Tracking dots */}
        <circle
          cx="-5.5"
          cy="5"
          r="1.5"
          fill={isDark ? `url(#${gradientIdDark})` : `url(#${gradientId})`}
          opacity="0.9"
        />
        <circle
          cx="0"
          cy="6"
          r="1.5"
          fill={isDark ? `url(#${gradientIdDark})` : `url(#${gradientId})`}
          opacity="0.9"
        />
        <circle
          cx="5.5"
          cy="5"
          r="1.5"
          fill={isDark ? `url(#${gradientIdDark})` : `url(#${gradientId})`}
          opacity="0.9"
        />
      </g>
    </svg>
  );

  if (variant === 'icon-only' || !showText) {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        {logoIcon}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      {!hideIcon && logoIcon}
      <div className="flex flex-col leading-[1.1]">
        <span className={cn(
          'font-black tracking-[-0.02em] uppercase', 
          textSize, 
          'gradient-text-primary'
        )}>
          Job
        </span>
        <span className={cn(
          'font-black tracking-[-0.02em] uppercase', 
          textSize, 
          'text-foreground'
        )}>
          Tracker
        </span>
      </div>
    </div>
  );
}
