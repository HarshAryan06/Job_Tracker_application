'use client';

import { useState, useMemo, useDeferredValue } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ApplicationCard } from '@/components/features/application-card';
import { useApplications } from '@/hooks';
import { filterApplications, calculateStats } from '@/lib/stats';
import { ApplicationStatus } from '@/types';
import { 
  Search, 
  Briefcase, 
  Filter, 
  Plus, 
  LayoutGrid, 
  List,
  SlidersHorizontal,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  X
} from 'lucide-react';

export default function ApplicationsPage() {
  const { applications, isLoaded } = useApplications();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const deferredSearch = useDeferredValue(searchTerm);
  
  const filteredApps = useMemo(
    () => filterApplications(applications, deferredSearch, statusFilter),
    [applications, deferredSearch, statusFilter]
  );

  const stats = useMemo(() => calculateStats(applications), [applications]);

  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'All';

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
  };

  const statusCounts = useMemo(() => {
    return {
      all: applications.length,
      applied: applications.filter(a => a.status === ApplicationStatus.APPLIED).length,
      pending: applications.filter(a => a.status === ApplicationStatus.PENDING).length,
      interviewing: applications.filter(a => a.status === ApplicationStatus.INTERVIEWING).length,
      offer: applications.filter(a => a.status === ApplicationStatus.OFFER).length,
      rejected: applications.filter(a => a.status === ApplicationStatus.REJECTED).length,
    };
  }, [applications]);

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
    <div className="space-y-8">
      {/* Header Section */}
      <header className="flex flex-col gap-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center shadow-lg glow-sm">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                <span className="gradient-text-primary">My</span> Applications
              </h2>
              <p className="text-muted-foreground text-xs font-medium">
                Tracking {applications.length} {applications.length === 1 ? 'company' : 'companies'}
              </p>
            </div>
          </div>
          
          <Link href="/add">
            <Button variant="gradient" className="gap-2 group">
              <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
              Add New
            </Button>
          </Link>
        </div>

        {/* Quick Stats Bar */}
        <div className="flex flex-wrap items-center gap-2 animate-fade-in-up stagger-1">
          {[
            { filter: 'All', icon: LayoutGrid, count: statusCounts.all, activeClass: 'gradient-bg text-white' },
            { filter: ApplicationStatus.APPLIED, icon: Clock, count: statusCounts.applied, activeClass: 'bg-blue-500 text-white', hoverClass: 'hover:bg-blue-500/10' },
            { filter: ApplicationStatus.INTERVIEWING, icon: TrendingUp, count: statusCounts.interviewing, activeClass: 'bg-orange-500 text-white', hoverClass: 'hover:bg-orange-500/10' },
            { filter: ApplicationStatus.OFFER, icon: CheckCircle, count: statusCounts.offer, activeClass: 'bg-emerald-500 text-white', hoverClass: 'hover:bg-emerald-500/10' },
            { filter: ApplicationStatus.REJECTED, icon: XCircle, count: statusCounts.rejected, activeClass: 'bg-rose-500 text-white', hoverClass: 'hover:bg-rose-500/10' },
          ].map((item) => (
            <Badge 
              key={item.filter}
              variant="secondary" 
              className={`px-3 py-1.5 cursor-pointer transition-all duration-300 ease-out hover:scale-105 ${statusFilter === item.filter ? item.activeClass : item.hoverClass || 'hover:bg-accent'}`}
              onClick={() => setStatusFilter(item.filter)}
            >
              <item.icon className="h-3 w-3 mr-1.5" />
              {item.filter === 'All' ? 'All' : item.filter} ({item.count})
            </Badge>
          ))}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="h-8 px-3 gap-1.5 text-xs font-medium transition-all duration-300 hover:scale-105 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
            >
              <X className="h-3 w-3" />
              Clear Filters
            </Button>
          )}
        </div>
        
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 animate-fade-in-up stagger-2">
          <div className="relative flex-1 max-w-lg search-bar group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground search-icon" />
            <Input
              type="text"
              placeholder="Search companies, roles, or notes..."
              className="pl-11 h-12 rounded-xl border-2 input-animated input-focus-glow bg-card"
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
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-card border rounded-xl p-1">
              <Filter className="h-4 w-4 text-muted-foreground ml-2" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] h-10 border-0 focus:ring-0">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="All" className="rounded-lg">All Status</SelectItem>
                  {Object.values(ApplicationStatus).map(status => (
                    <SelectItem key={status} value={status} className="rounded-lg">{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* View Toggle */}
            <div className="hidden sm:flex items-center bg-card border rounded-xl p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon-sm"
                onClick={() => setViewMode('grid')}
                className="rounded-lg transition-all duration-200"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon-sm"
                onClick={() => setViewMode('list')}
                className="rounded-lg transition-all duration-200"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Results Count */}
      {searchTerm && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground animate-fade-in">
          <SlidersHorizontal className="h-4 w-4" />
          Found <span className="font-semibold text-foreground">{filteredApps.length}</span> results for "{searchTerm}"
        </div>
      )}

      {/* Applications Grid/List */}
      <div className={`
        ${viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' 
          : 'flex flex-col gap-3'
        }
      `}>
        {filteredApps.map((app, index) => (
          <div 
            key={app.id} 
            className="animate-fade-in-up"
            style={{ animationDelay: `${Math.min(index * 0.05, 0.25)}s` }}
          >
            <ApplicationCard app={app} />
          </div>
        ))}
        
        {filteredApps.length === 0 && (
          <Card className="col-span-full animate-scale-in">
            <CardContent className="py-20 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center border border-border">
                <Briefcase className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-2">
                {applications.length === 0 ? 'No applications yet' : 'No matching applications'}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
                {applications.length === 0 
                  ? 'Start tracking your job search by adding your first application.' 
                  : 'Try adjusting your search term or filter to find what you\'re looking for.'
                }
              </p>
              {applications.length === 0 && (
                <Link href="/add">
                  <Button variant="gradient" className="gap-2 group">
                    <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
                    Add Your First Application
                  </Button>
                </Link>
              )}
              {applications.length > 0 && searchTerm && (
                <Button variant="outline" onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}>
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination hint */}
      {filteredApps.length > 12 && (
        <div className="text-center text-sm text-muted-foreground animate-fade-in">
          Showing all {filteredApps.length} applications
        </div>
      )}
    </div>
  );
}
