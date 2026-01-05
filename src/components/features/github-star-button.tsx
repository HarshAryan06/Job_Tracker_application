'use client';

import { useState, useEffect } from 'react';
import { useGitHubStars } from '@/hooks/use-github-stars';
import GithubIcon from '@/components/ui/github-icon';

export function GitHubStarButton() {
  const [isMounted, setIsMounted] = useState(false);
  const { starCount, isLoading, repoUrl, isConfigured } = useGitHubStars();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !isConfigured) {
    return null;
  }

  return (
    <a
      href={repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 h-8 sm:h-9 rounded-lg border border-border/50 bg-card/50 hover:bg-card/80 active:scale-95 transition-all duration-200 group"
    >
      <GithubIcon size={14} color="currentColor" className="sm:w-4 sm:h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      <span className="text-xs sm:text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
        {isLoading ? '...' : starCount !== null && typeof starCount === 'number' ? starCount.toLocaleString() : 'Star'}
      </span>
    </a>
  );
}

