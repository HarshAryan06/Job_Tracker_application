'use client';

import { useState, useMemo, useDeferredValue, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useApplications } from '@/hooks';
import { filterApplications } from '@/lib/stats';
import { Search, Briefcase, ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusBadge } from '@/components/features/status-badge';
import { Application } from '@/types';

export default function SearchPage() {
  const { applications, isLoaded } = useApplications();
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const deferredSearch = useDeferredValue(searchTerm);
  
  const filteredApps = useMemo(
    () => filterApplications(applications, deferredSearch, 'All'),
    [applications, deferredSearch]
  );

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleResultClick = (appId: string) => {
    router.push(`/applications/${appId}`);
  };

  const clearSearch = () => {
    setSearchTerm('');
    inputRef.current?.focus();
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-3 border-primary/20 border-t-primary animate-spin" />
          <p className="text-muted-foreground font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Search Applications
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Find applications by company name or job role
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search by company or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-11 pr-10 h-12 text-base"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-accent transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Results */}
      {searchTerm && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Found <span className="font-semibold text-foreground">{filteredApps.length}</span> result{filteredApps.length !== 1 ? 's' : ''}
            </p>
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="text-xs"
              >
                Clear
              </Button>
            )}
          </div>

          {filteredApps.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold mb-2">No results found</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  No applications match "{searchTerm}". Try a different search term or check your spelling.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {filteredApps.map((app: Application) => (
                <Card
                  key={app.id}
                  className="group cursor-pointer card-hover"
                  onClick={() => handleResultClick(app.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <h3 className="text-base font-bold truncate group-hover:text-primary transition-colors">
                            {app.companyName}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 truncate">
                          {app.role}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <StatusBadge status={app.status} size="sm" />
                          {app.location && (
                            <span className="text-xs text-muted-foreground">
                              {app.location}
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty State - No Search */}
      {!searchTerm && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold mb-2">Start searching</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Enter a company name or job role in the search box above to find your applications.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

