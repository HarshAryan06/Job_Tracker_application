'use client';

import React, { useMemo } from 'react';
import { cn } from '@/utils';
import { Application, DateNote } from '@/types';
import { dateUtils } from '@/utils/date';
import { Briefcase } from 'lucide-react';

interface MonthViewProps {
    currentDate: Date;
    applications: Application[];
    dateNotes: DateNote[];
    onDateClick: (date: Date) => void;
    searchQuery?: string;
}

export function MonthView({ currentDate, applications, dateNotes, onDateClick, searchQuery = '' }: MonthViewProps) {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const today = new Date();

    // Create calendar grid logic (reused/adapted)
    const calendarDays = useMemo(() => {
        const days: { date: Date; isCurrentMonth: boolean }[] = [];

        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Previous month days to fill grid
        const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            days.push({
                date: new Date(currentYear, currentMonth - 1, prevMonthDays - i),
                isCurrentMonth: false
            });
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            days.push({
                date: new Date(currentYear, currentMonth, day),
                isCurrentMonth: true
            });
        }

        // Next month days to fill grid (up to 42 cells for 6 rows)
        const remainingCells = 42 - days.length;
        for (let i = 1; i <= remainingCells; i++) {
            days.push({
                date: new Date(currentYear, currentMonth + 1, i),
                isCurrentMonth: false
            })
        }

        return days;
    }, [currentYear, currentMonth]);

    const isToday = (date: Date) => {
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Filter applications and notes based on search query
    const matchesSearchQuery = (text: string): boolean => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase().trim();
        return text.toLowerCase().includes(query);
    };

    const applicationMatchesSearch = (app: Application): boolean => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase().trim();
        return (
            matchesSearchQuery(app.companyName) ||
            matchesSearchQuery(app.role) ||
            matchesSearchQuery(app.location) ||
            matchesSearchQuery(app.status) ||
            matchesSearchQuery(app.jobDescription || '') ||
            matchesSearchQuery(app.notes || '') ||
            matchesSearchQuery(app.resumeName || '')
        );
    };

    const noteMatchesSearch = (note: DateNote): boolean => {
        if (!searchQuery.trim()) return true;
        return matchesSearchQuery(note.note);
    };

    const getApplicationsForDate = (date: Date) => {
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        let filteredApps = applications.filter(app => {
            try {
                const appDate = new Date(app.dateApplied);
                appDate.setHours(0, 0, 0, 0);
                return appDate.getTime() === targetDate.getTime();
            } catch {
                const dateStr = dateUtils.formatDate(date);
                return app.dateApplied === dateStr ||
                    app.dateApplied.includes(dateStr.split(',')[0].trim());
            }
        });

        // Apply search filter if query exists
        if (searchQuery.trim()) {
            filteredApps = filteredApps.filter(applicationMatchesSearch);
        }

        return filteredApps;
    };

    const getNoteForDate = (date: Date) => {
        const isoDate = dateUtils.formatISO(date);
        const note = dateNotes.find(note => note.date === isoDate);
        
        // If search query exists, check if note matches
        if (note && searchQuery.trim() && !noteMatchesSearch(note)) {
            return undefined;
        }
        
        return note;
    };

    // Check if a date has any matching content (for highlighting)
    const hasMatchingContent = (date: Date): boolean => {
        if (!searchQuery.trim()) return true;
        const dateApps = getApplicationsForDate(date);
        const dateNote = getNoteForDate(date);
        return dateApps.length > 0 || dateNote !== undefined;
    };

    const shortDayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
        <div className="flex flex-col h-full bg-background border-l border-border">
            {/* Day Headers */}
            <div className="grid grid-cols-7 border-b border-border">
                {dayNames.map((day, idx) => (
                    <div key={day} className="py-1 sm:py-1.5 md:py-2 text-center text-[9px] sm:text-[10px] md:text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                        <span className="hidden sm:inline">{day}</span>
                        <span className="sm:hidden">{shortDayNames[idx]}</span>
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 grid-rows-6 flex-1 auto-rows-fr">
                {calendarDays.map((cell, index) => {
                    const { date, isCurrentMonth } = cell;
                    const isCurrentDay = isToday(date);
                    const dateApps = getApplicationsForDate(date);
                    const dateNote = getNoteForDate(date);

                    // Format for display
                    const dayNumber = date.getDate();
                    // Show logical shorthand like "1 Jun" on the first day of month (only on larger screens)
                    const displayLabel = dayNumber;

                    const hasMatch = hasMatchingContent(date);
                    const shouldHighlight = searchQuery.trim() && hasMatch;
                    const shouldDim = searchQuery.trim() && !hasMatch && isCurrentMonth;

                    // Limit apps shown based on screen size - show fewer on mobile
                    const maxAppsToShow = 2; // We'll handle responsive display with CSS

                    return (
                        <div
                            key={index}
                            onClick={() => onDateClick(date)}
                            className={cn(
                                "border-b border-r border-border min-h-[50px] sm:min-h-[65px] md:min-h-[80px] lg:min-h-[100px] p-0.5 sm:p-1 md:p-1.5 lg:p-2 transition-colors active:bg-accent/70 hover:bg-accent/50 cursor-pointer flex flex-col gap-0.5 sm:gap-0.5 md:gap-1 overflow-hidden touch-manipulation",
                                !isCurrentMonth && "bg-muted/20 dark:bg-muted/10 text-muted-foreground",
                                shouldHighlight && "bg-primary/5 dark:bg-primary/10 border-primary/30",
                                shouldDim && "opacity-40"
                            )}
                        >
                            <div className="flex justify-center mb-0 sm:mb-0.5 md:mb-1">
                                <span className={cn(
                                    "text-[10px] sm:text-xs md:text-sm font-semibold tracking-tight h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 flex items-center justify-center rounded-full touch-manipulation transition-all",
                                    isCurrentDay
                                        ? "bg-primary text-primary-foreground font-bold scale-110"
                                        : isCurrentMonth ? "text-foreground font-semibold" : "text-muted-foreground font-medium opacity-60"
                                )}>
                                    {displayLabel}
                                </span>
                            </div>

                            <div className="flex-1 flex flex-col gap-0.5 sm:gap-0.5 md:gap-1 overflow-y-auto overflow-x-hidden">
                                {dateApps.slice(0, maxAppsToShow).map(app => (
                                    <div key={app.id} className="bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[8px] sm:text-[9px] md:text-[10px] px-0.5 sm:px-1 md:px-1.5 py-0.5 rounded truncate font-medium border-l-2 border-emerald-500 dark:border-emerald-400 transition-colors">
                                        <span className="hidden sm:inline">{app.companyName}</span>
                                        <span className="sm:hidden">{app.companyName.substring(0, 6)}{app.companyName.length > 6 ? '...' : ''}</span>
                                    </div>
                                ))}
                                {dateApps.length > maxAppsToShow && (
                                    <div className="bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[8px] sm:text-[9px] md:text-[10px] px-0.5 sm:px-1 md:px-1.5 py-0.5 rounded font-medium border-l-2 border-emerald-500 dark:border-emerald-400">
                                        +{dateApps.length - maxAppsToShow}
                                    </div>
                                )}
                                {dateNote && (
                                    <div className="bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[8px] sm:text-[9px] md:text-[10px] px-0.5 sm:px-1 md:px-1.5 py-0.5 rounded truncate font-medium border-l-2 border-amber-500 dark:border-amber-400 transition-colors">
                                        Note
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
