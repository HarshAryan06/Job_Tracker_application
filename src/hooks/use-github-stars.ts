'use client';

import { useState, useEffect } from 'react';
import { GitHubApiService } from '@/services/github';
import type { CacheData } from '@/services/github';

export function useGitHubStars() {
  // Safe defaults for SSR - always start with false loading state
  const [starCount, setStarCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    const fetchStars = async () => {
      try {
        setIsLoading(true);
        
        // Check cache first
        const cached = GitHubApiService.getCache();
          if (cached) {
          setStarCount(cached.count);
                setIsLoading(false);
                return;
              }

        // Fetch from API
        const count = await GitHubApiService.fetchStars();
              setStarCount(count);
        GitHubApiService.setCache(count);
        setError(null);
      } catch (err: unknown) {
        console.error('Error fetching GitHub stars:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Try to use cached value on error
        const cached = GitHubApiService.getCache();
          if (cached) {
          setStarCount(cached.count);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if configured
    if (GitHubApiService.isConfigured()) {
      fetchStars();
    } else {
      setIsLoading(false);
    }
  }, []);

  return {
    starCount,
    isLoading,
    error,
    repoUrl: GitHubApiService.getRepoUrl(),
    isConfigured: GitHubApiService.isConfigured(),
  };
}

