'use client';

import { useState, useMemo, useDeferredValue, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useApplications } from '@/hooks';
import { filterApplications } from '@/lib/stats';
import { Search, Briefcase, XCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
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
    if (open && inputRef.current) {
      // Small delay to ensure dialog is fully rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setSearchTerm('');
    }
  }, [open]);

  const handleResultClick = (appId: string) => {
    router.push(`/applications/${appId}`);
    onOpenChange(false);
    setSearchTerm('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Search Applications
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-6 pt-4 pb-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search companies, roles, or notes..."
              className="pl-11 pr-10 h-12 rounded-xl border-2 bg-card"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {!isLoaded ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 rounded-full border-3 border-primary/20 border-t-primary animate-spin" />
            </div>
          ) : searchTerm ? (
            filteredApps.length > 0 ? (
              <div className="space-y-2 pt-2">
                <p className="text-sm text-muted-foreground mb-3">
                  Found {filteredApps.length} {filteredApps.length === 1 ? 'result' : 'results'}
                </p>
                {filteredApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleResultClick(app.id)}
                    className={cn(
                      'w-full text-left p-4 rounded-xl border bg-card hover:bg-accent/50',
                      'transition-all duration-200 hover:border-primary/50 hover:shadow-md',
                      'group flex items-center justify-between gap-4'
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Briefcase className="h-4 w-4 text-primary flex-shrink-0" />
                        <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {app.companyName}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {app.role}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {app.status}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-2xl gradient-bg-subtle flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-primary/50" />
                </div>
                <h3 className="text-lg font-bold mb-2">No results found</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Try adjusting your search term to find what you're looking for.
                </p>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-2xl gradient-bg-subtle flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-primary/50" />
              </div>
              <h3 className="text-lg font-bold mb-2">Start searching</h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-4">
                Search through your applications by company name, role, or notes.
              </p>
              {applications.length > 0 && (
                <Link href="/applications">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    View All Applications
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

