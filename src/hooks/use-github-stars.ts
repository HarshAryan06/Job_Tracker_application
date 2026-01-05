'use client';

import { useState, useEffect } from 'react';

// Update these with your GitHub username and repository name
const GITHUB_USERNAME = 'your-username'; // Replace with your GitHub username
const GITHUB_REPO = 'your-repo-name'; // Replace with your repository name

interface GitHubRepo {
  stargazers_count: number;
  full_name: string;
}

export function useGitHubStars() {
  const [starCount, setStarCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        setIsLoading(true);
        
        // Check localStorage for cached data (5 minute cache)
        const cacheKey = `github-stars-${GITHUB_USERNAME}-${GITHUB_REPO}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { count, timestamp } = JSON.parse(cached);
          const now = Date.now();
          // Use cache if less than 5 minutes old
          if (now - timestamp < 5 * 60 * 1000) {
            setStarCount(count);
            setIsLoading(false);
            return;
          }
        }

        // Using GitHub REST API v3 (no authentication needed for public repos)
        const response = await fetch(
          `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}`,
          {
            headers: {
              Accept: 'application/vnd.github.v3+json',
            },
          }
        );

        if (!response.ok) {
          // If rate limited, try to use cached value
          if (response.status === 403 && cached) {
            const { count } = JSON.parse(cached);
            setStarCount(count);
            setIsLoading(false);
            return;
          }
          throw new Error('Failed to fetch repository data');
        }

        const data: GitHubRepo = await response.json();
        setStarCount(data.stargazers_count);
        
        // Cache the result
        localStorage.setItem(cacheKey, JSON.stringify({
          count: data.stargazers_count,
          timestamp: Date.now(),
        }));
        
        setError(null);
      } catch (err) {
        console.error('Error fetching GitHub stars:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Try to use cached value on error
        const cacheKey = `github-stars-${GITHUB_USERNAME}-${GITHUB_REPO}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { count } = JSON.parse(cached);
          setStarCount(count);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if username and repo are configured
    if (GITHUB_USERNAME !== 'your-username' && GITHUB_REPO !== 'your-repo-name') {
      fetchStars();
    } else {
      setIsLoading(false);
    }
  }, []);

  return {
    starCount,
    isLoading,
    error,
    repoUrl: `https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO}`,
    isConfigured: GITHUB_USERNAME !== 'your-username' && GITHUB_REPO !== 'your-repo-name',
  };
}

