'use client';

import { useMemo } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { Separator } from '@/components/ui/separator';
import { StatsSection } from '@/components/features/stats-section';
import { StatusBadge } from '@/components/features/status-badge';
import { useApplications } from '@/hooks';
import { calculateStats } from '@/lib/stats';
import { ApplicationStatus } from '@/types';
import { applicationSelectors } from '@/selectors';
import { dateUtils } from '@/utils/date';
import {
  Briefcase,
  FileText,
  ChevronRight,
  Plus,
  ArrowRight,
  TrendingUp,
  Target,
  Calendar,
  Zap,
  Moon,
  Sun
} from 'lucide-react';

export default function DashboardPage() {
  const { applications, isLoaded } = useApplications();
  const { theme, setTheme } = useTheme();

  const stats = useMemo(() => calculateStats(applications), [applications]);
  const uniqueResumes = useMemo(
    () => applicationSelectors.uniqueResumes(applications).slice(0, 3),
    [applications]
  );

  const thisWeekApps = useMemo(() => {
    return applicationSelectors.thisWeek(applications).length;
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
          <HoverBorderGradient
            as="div"
            containerClassName="rounded-full"
            className="bg-background/80 dark:bg-background/80 text-foreground border-0"
            duration={1.5}
          >
            <span className="text-xs font-semibold px-3 py-1.5">
              Track Your Career
            </span>
          </HoverBorderGradient>
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] animate-fade-in-up stagger-1">
          <span className="gradient-text-primary">Track Every</span>
          <br />
          <span className="text-foreground">Application.</span>
        </h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-md font-medium leading-relaxed animate-fade-in-up stagger-2">
          Keep track of all the companies you&apos;ve applied to. Never lose track of your job search progress.
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
      {applications.length > 0 ? (
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
                    {applications.length} total
                  </p>
                </div>
              </div>
              <Link href="/applications">
                <Button variant="ghost" size="sm" className="h-8 px-3 text-xs font-semibold group">
                  View All
                  <ArrowRight className="h-3 w-3 ml-1.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              {applications.slice(0, 5).map((app, index) => (
                <Link key={app.id} href={`/applications/${app.id}`}>
                  <div
                    className="flex items-center justify-between p-4 rounded-xl border-2 border-border bg-card hover:border-primary/50 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent cursor-pointer transition-all duration-300 ease-out group shadow-sm hover:shadow-md"
                    style={{ animationDelay: `${0.6 + index * 0.05}s` }}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center border border-border transition-all duration-300 ease-out group-hover:bg-accent shrink-0">
                        <Briefcase className="h-5 w-5 text-muted-foreground transition-colors duration-300 group-hover:text-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate transition-colors duration-300 group-hover:text-primary mb-0.5">{app.companyName}</p>
                        <p className="text-xs text-muted-foreground font-medium truncate mb-1">
                          {app.role}
                        </p>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={app.status} size="sm" />
                          <span className="text-[10px] text-muted-foreground/70 font-medium">
                            {dateUtils.formatShortDate(app.dateApplied)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:text-primary group-hover:translate-x-1 shrink-0 ml-2" />
                  </div>
                </Link>
              ))}
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
                    {uniqueResumes.length} resume{uniqueResumes.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              {uniqueResumes.map((name, index) => {
                const usageCount = applicationSelectors.resumeUsageCount(applications, name);
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
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Centered Empty State Card */
        <div className="flex justify-center animate-fade-in-up stagger-5">
          <Card className="w-full max-w-2xl overflow-hidden border-2 hover:border-primary/30 transition-all duration-300">
            <CardContent className="p-8 md:p-12">
              <div className="text-center space-y-6">
                {/* Icon Section */}
                <div className="flex justify-center gap-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl gradient-bg flex items-center justify-center shadow-lg transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                    <Briefcase className="h-8 w-8 md:h-10 md:w-10 text-white" />
                  </div>
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg transform rotate-6 hover:rotate-0 transition-transform duration-300">
                    <FileText className="h-8 w-8 md:h-10 md:w-10 text-white" />
                  </div>
                </div>

                {/* Text Content */}
                <div className="space-y-3">
                  <h3 className="text-xl md:text-2xl font-extrabold tracking-tight">
                    <span className="gradient-text-primary">Start Your</span> Job Search Journey
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Track every application, manage your resumes, and never lose sight of your career progress. Add your first application to get started!
                  </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-xs font-semibold">Track Progress</p>
                    <p className="text-[10px] text-muted-foreground">Monitor every stage</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-xs font-semibold">View Analytics</p>
                    <p className="text-[10px] text-muted-foreground">See your stats</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-xs font-semibold">Stay Organized</p>
                    <p className="text-[10px] text-muted-foreground">Never miss a follow-up</p>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-2">
                  <Link href="/add">
                    <Button variant="gradient" size="lg" className="gap-2 group px-8">
                      <Plus className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
                      Add Your First Application
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mobile Footer - Only visible on home page mobile view */}
      <div className="md:hidden mt-8 mb-4">
        <div className="border-t border-border/30 pt-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-sm text-muted-foreground">
              Built with <span className="text-amber-500">🍵</span> by{' '}
              <span className="font-semibold gradient-text-primary">Harsh</span>
            </p>
            <p className="text-xs text-muted-foreground">
              © 2026 All rights reserved
            </p>
            <div className="flex items-center gap-4">
              {/* X (Twitter) */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                aria-label="X (Twitter)"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* GitHub */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                aria-label="GitHub"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              {/* Theme Toggle - Simple Button */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 p-1"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-border/30 mt-6"></div>
      </div>
    </div>
  );
}
