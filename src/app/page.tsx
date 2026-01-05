'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { StatsSection } from '@/components/features/stats-section';
import { StatusBadge } from '@/components/features/status-badge';
import { useApplications } from '@/hooks';
import { calculateStats } from '@/lib/stats';
import { ApplicationStatus } from '@/types';
import {
  Briefcase,
  FileText,
  ChevronRight,
  Plus,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Target,
  Calendar,
  Zap
} from 'lucide-react';

export default function DashboardPage() {
  const { applications, isLoaded } = useApplications();

  const stats = useMemo(() => calculateStats(applications), [applications]);
  const uniqueResumes = useMemo(
    () => Array.from(new Set(applications.map(a => a.resumeName))).slice(0, 3),
    [applications]
  );

  const thisWeekApps = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return applications.filter(app => new Date(app.dateApplied) >= oneWeekAgo).length;
  }, [applications]);

  const responseRate = useMemo(() => {
    if (applications.length === 0) return 0;
    const responded = applications.filter(app =>
      app.status !== ApplicationStatus.APPLIED && app.status !== ApplicationStatus.PENDING
    ).length;
    return Math.round((responded / applications.length) * 100);
  }, [applications]);

  const interviewRate = useMemo(() => {
    if (applications.length === 0) return 0;
    return Math.round((stats.interviews / applications.length) * 100);
  }, [applications, stats.interviews]);

  const offerRate = useMemo(() => {
    if (applications.length === 0) return 0;
    return Math.round((stats.offers / applications.length) * 100);
  }, [applications, stats.offers]);

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
    <div className="space-y-10">
      {/* Hero Section */}
      <div className="space-y-5">
        <div className="animate-fade-in">
          <Badge variant="secondary" className="gradient-bg-subtle border-0 text-xs font-semibold px-3 py-1.5">
            <Sparkles className="h-3 w-3 mr-1.5" />
            Track Your Career
          </Badge>
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] animate-fade-in-up stagger-1">
          <span className="gradient-text-primary">Track Every</span>
          <br />
          <span className="text-foreground">Application.</span>
        </h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-md font-medium leading-relaxed animate-fade-in-up stagger-2">
          Keep track of all the companies you've applied to. Never lose track of your job search progress.
        </p>
        <div className="flex flex-wrap gap-4 pt-2 animate-fade-in-up stagger-3">
          <Link href="/add">
            <Button variant="gradient" size="lg" className="gap-2 group">
              <Plus className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
              Add Application
            </Button>
          </Link>
          <Link href="/applications">
            <Button variant="outline" size="lg" className="gap-2 group">
              View All
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats Banner - Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Zap, value: thisWeekApps, label: 'This Week', color: 'from-orange-500 to-amber-500', textColor: 'stats-number' },
          { icon: TrendingUp, value: `${responseRate}%`, label: 'Response Rate', color: 'from-emerald-500 to-green-500', textColor: 'text-emerald-500' },
          { icon: Target, value: `${interviewRate}%`, label: 'Interview Rate', color: 'from-blue-500 to-cyan-500', textColor: 'text-blue-500' },
          { icon: Calendar, value: `${offerRate}%`, label: 'Offer Rate', color: 'from-purple-500 to-pink-500', textColor: 'text-purple-500' },
        ].map((stat, index) => (
          <Card
            key={stat.label}
            className="card-hover overflow-hidden group animate-fade-in-up"
            style={{ animationDelay: `${0.3 + index * 0.1}s` }}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg transition-transform duration-500 ease-out group-hover:scale-110`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Section */}
      <div className="animate-fade-in-up stagger-4">
        <StatsSection stats={stats} />
      </div>

      <Separator className="my-8 opacity-50" />

      {/* Recent Applications & Resumes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Applications Card */}
        <Card className="overflow-hidden animate-fade-in-left stagger-5 card-hover border-2 hover:border-primary/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between p-6 pb-5 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-lg">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 m-0 leading-none">
                  Recent Applications
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {applications.length > 0 ? `${applications.length} total` : 'Get started'}
                </p>
              </div>
            </div>
            {applications.length > 0 && (
              <Link href="/applications">
                <Button variant="ghost" size="sm" className="h-8 px-3 text-xs font-semibold group">
                  View All
                  <ArrowRight className="h-3 w-3 ml-1.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            )}
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            {applications.slice(0, 5).map((app, index) => (
              <Link key={app.id} href={`/applications/${app.id}`}>
                <div
                  className="flex items-center justify-between p-4 rounded-xl border-2 border-border bg-card hover:border-primary/50 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent cursor-pointer transition-all duration-300 ease-out group shadow-sm hover:shadow-md"
                  style={{ animationDelay: `${0.6 + index * 0.05}s` }}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 gradient-bg-subtle rounded-xl flex items-center justify-center transition-all duration-500 ease-out group-hover:bg-gradient-to-br group-hover:from-orange-500 group-hover:to-amber-500 group-hover:scale-110 group-hover:shadow-lg shrink-0">
                      <Briefcase className="h-5 w-5 text-primary transition-colors duration-300 group-hover:text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate transition-colors duration-300 group-hover:text-primary mb-0.5">{app.companyName}</p>
                      <p className="text-xs text-muted-foreground font-medium truncate mb-1">
                        {app.role}
                      </p>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={app.status} size="sm" />
                        <span className="text-[10px] text-muted-foreground/70 font-medium">
                          {new Date(app.dateApplied).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:text-primary group-hover:translate-x-1 shrink-0 ml-2" />
                </div>
              </Link>
            ))}
            {applications.length === 0 && (
              <div className="text-center py-12 gradient-bg-subtle rounded-2xl border-2 border-dashed border-border/50">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl gradient-bg-subtle flex items-center justify-center shadow-lg">
                  <Briefcase className="h-10 w-10 text-primary/50" />
                </div>
                <h3 className="text-base font-bold mb-2">No Applications Yet</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-xs mx-auto">
                  Start tracking your job search by adding your first application.
                </p>
                <Link href="/add">
                  <Button variant="gradient" size="sm" className="gap-2 group">
                    <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
                    Add Your First Application
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Resumes Card */}
        <Card className="overflow-hidden animate-fade-in-right stagger-5 card-hover border-2 hover:border-rose-500/30 transition-all duration-300">
          <CardHeader className="p-6 pb-5 bg-gradient-to-r from-rose-500/5 via-rose-500/10 to-transparent border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 m-0 leading-none">
                  Active Resumes
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {uniqueResumes.length > 0 ? `${uniqueResumes.length} resume${uniqueResumes.length !== 1 ? 's' : ''}` : 'No resumes yet'}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            {uniqueResumes.map((name, index) => {
              const usageCount = applications.filter(a => a.resumeName === name).length;
              return (
                <div
                  key={name}
                  className="flex items-center justify-between p-4 rounded-xl border-2 border-border bg-card hover:border-rose-500/50 hover:bg-gradient-to-r hover:from-rose-500/5 hover:to-transparent transition-all duration-300 ease-out group shadow-sm hover:shadow-md cursor-pointer"
                  style={{ animationDelay: `${0.6 + index * 0.05}s` }}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center transition-all duration-500 ease-out group-hover:bg-gradient-to-br group-hover:from-rose-500 group-hover:to-pink-500 group-hover:scale-110 group-hover:shadow-lg shrink-0">
                      <FileText className="h-5 w-5 text-rose-500 transition-colors duration-300 group-hover:text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold uppercase tracking-tight transition-colors duration-300 group-hover:text-rose-500 mb-0.5 truncate">{name}</p>
                      <p className="text-xs text-muted-foreground font-medium">
                        Used in {usageCount} {usageCount === 1 ? 'application' : 'applications'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0.5 bg-rose-500/10 text-rose-500 border-0">
                      {usageCount}
                    </Badge>
                    <ChevronRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:text-rose-500 group-hover:translate-x-1" />
                  </div>
                </div>
              );
            })}
            {applications.length === 0 && (
              <div className="text-center py-12 gradient-bg-subtle rounded-2xl border-2 border-dashed border-border/50">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-rose-500/10 flex items-center justify-center shadow-lg">
                  <FileText className="h-10 w-10 text-rose-500/50" />
                </div>
                <h3 className="text-base font-bold mb-2">No Resumes Logged</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Resumes will appear here once you start adding applications.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
