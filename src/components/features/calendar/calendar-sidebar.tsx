'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, ChevronDown, ChevronUp, Calendar, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/utils';
import { useRouter } from 'next/navigation';
import { Application } from '@/types';

interface CalendarSidebarProps {
    className?: string;
    onDateClick?: (date: Date) => void;
    currentDate?: Date;
    onCalendarTypeChange?: (type: 'tasks' | 'reminders' | 'applications', enabled: boolean) => void;
    onNavigate?: (date: Date) => void;
    applications?: Application[];
}

export function CalendarSidebar({ className, onDateClick, currentDate = new Date(), onCalendarTypeChange, onNavigate, applications = [] }: CalendarSidebarProps) {
    const [isMyCalendarsOpen, setIsMyCalendarsOpen] = useState(true);
    const [isQuickNavOpen, setIsQuickNavOpen] = useState(false);
    const [calendarTypes, setCalendarTypes] = useState({
        tasks: true,
        reminders: true,
        applications: true
    });
    const router = useRouter();
    const today = new Date();

    // Quick navigation handlers
    const handleQuickNav = (type: 'today' | 'thisWeek' | 'nextWeek' | 'thisMonth' | 'nextMonth') => {
        if (!onNavigate) return;
        const newDate = new Date();
        
        switch (type) {
            case 'today':
                newDate.setDate(today.getDate());
                break;
            case 'thisWeek':
                const dayOfWeek = today.getDay();
                newDate.setDate(today.getDate() - dayOfWeek);
                break;
            case 'nextWeek':
                const nextWeekDay = today.getDay();
                newDate.setDate(today.getDate() - nextWeekDay + 7);
                break;
            case 'thisMonth':
                newDate.setDate(1);
                break;
            case 'nextMonth':
                newDate.setMonth(today.getMonth() + 1);
                newDate.setDate(1);
                break;
        }
        onNavigate(newDate);
    };

    // Calculate stats
    const getUpcomingCount = () => {
        if (!applications || applications.length === 0) return 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return applications.filter(app => {
            if (!app || !app.dateApplied) return false;
            try {
                const appDate = new Date(app.dateApplied);
                appDate.setHours(0, 0, 0, 0);
                return appDate >= today;
            } catch {
                return false;
            }
        }).length;
    };

    const getThisWeekCount = () => {
        if (!applications || applications.length === 0) return 0;
        const today = new Date();
        const dayOfWeek = today.getDay();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - dayOfWeek);
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        return applications.filter(app => {
            if (!app || !app.dateApplied) return false;
            try {
                const appDate = new Date(app.dateApplied);
                return appDate >= startOfWeek && appDate <= endOfWeek;
            } catch {
                return false;
            }
        }).length;
    };

    const handleCreate = () => {
        router.push('/add');
    };

    const handleCalendarTypeToggle = (type: 'tasks' | 'reminders' | 'applications', event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        setCalendarTypes(prev => ({ ...prev, [type]: checked }));
        if (onCalendarTypeChange) {
            onCalendarTypeChange(type, checked);
        }
    };

    const handleMiniCalendarClick = (day: number, isCurrentMonth: boolean, isPrevMonth: boolean) => {
        if (onDateClick) {
            const newDate = new Date(currentDate);
            if (isPrevMonth) {
                newDate.setMonth(newDate.getMonth() - 1);
            } else if (!isCurrentMonth) {
                newDate.setMonth(newDate.getMonth() + 1);
            }
            newDate.setDate(day);
            onDateClick(newDate);
        }
    };

    const getMiniCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const prevMonthDays = new Date(year, month, 0).getDate();
        const today = new Date();
        
        const days: { day: number; isCurrentMonth: boolean; isPrevMonth: boolean; isToday: boolean }[] = [];
        
        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = prevMonthDays - i;
            days.push({ day, isCurrentMonth: false, isPrevMonth: true, isToday: false });
        }
        
        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = day === today.getDate() && 
                           month === today.getMonth() && 
                           year === today.getFullYear();
            days.push({ day, isCurrentMonth: true, isPrevMonth: false, isToday });
        }
        
        // Fill remaining cells (next month)
        const remaining = 42 - days.length;
        for (let day = 1; day <= remaining; day++) {
            days.push({ day, isCurrentMonth: false, isPrevMonth: false, isToday: false });
        }
        
        return days;
    };

    return (
        <aside className={cn("w-56 md:w-64 flex flex-col p-2 md:p-3 gap-3 md:gap-4 h-full bg-background border-r border-border", className)}>
            <div className="flex justify-center px-0.5 pt-4 md:pt-5">
                <Button
                    variant="gradient"
                    className="w-full max-w-[180px] md:max-w-[200px] h-9 md:h-10 rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
                    onClick={handleCreate}
                >
                    <div className="flex items-center justify-center gap-1.5 md:gap-2">
                        <div className="w-6 h-6 md:w-7 md:h-7 rounded-md md:rounded-lg bg-white/20 dark:bg-white/10 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                            <Plus className="h-3 w-3 md:h-3.5 md:w-3.5 text-white" />
                        </div>
                        <span className="font-semibold text-[11px] md:text-xs text-white">Create</span>
                    </div>
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto pt-2 md:pt-3">
                {/* Quick Navigation */}
                <div className="mb-3 md:mb-4 px-1 md:px-2">
                    <button
                        className="flex items-center justify-between w-full p-1.5 md:p-2 hover:bg-accent rounded-md mb-0.5 md:mb-1 transition-colors"
                        onClick={() => setIsQuickNavOpen(!isQuickNavOpen)}
                    >
                        <div className="flex items-center gap-1.5 md:gap-2">
                            <Clock className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
                            <span className="font-medium text-xs md:text-sm">Quick Navigation</span>
                        </div>
                        {isQuickNavOpen ? <ChevronUp className="h-3.5 w-3.5 md:h-4 md:w-4" /> : <ChevronDown className="h-3.5 w-3.5 md:h-4 md:w-4" />}
                    </button>

                    {isQuickNavOpen && (
                        <div className="space-y-1 md:space-y-1.5 mt-1 md:mt-1.5 px-1 md:px-1.5">
                            <button
                                onClick={() => handleQuickNav('today')}
                                className="w-full flex items-center gap-2 p-1.5 md:p-2 hover:bg-accent rounded-md transition-colors text-left"
                            >
                                <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                                <span className="text-xs md:text-sm font-normal">Today</span>
                            </button>
                            <button
                                onClick={() => handleQuickNav('thisWeek')}
                                className="w-full flex items-center gap-2 p-1.5 md:p-2 hover:bg-accent rounded-md transition-colors text-left"
                            >
                                <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                                <span className="text-xs md:text-sm font-normal">This Week</span>
                            </button>
                            <button
                                onClick={() => handleQuickNav('nextWeek')}
                                className="w-full flex items-center gap-2 p-1.5 md:p-2 hover:bg-accent rounded-md transition-colors text-left"
                            >
                                <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                                <span className="text-xs md:text-sm font-normal">Next Week</span>
                            </button>
                            <button
                                onClick={() => handleQuickNav('thisMonth')}
                                className="w-full flex items-center gap-2 p-1.5 md:p-2 hover:bg-accent rounded-md transition-colors text-left"
                            >
                                <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                                <span className="text-xs md:text-sm font-normal">This Month</span>
                            </button>
                            <button
                                onClick={() => handleQuickNav('nextMonth')}
                                className="w-full flex items-center gap-2 p-1.5 md:p-2 hover:bg-accent rounded-md transition-colors text-left"
                            >
                                <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                                <span className="text-xs md:text-sm font-normal">Next Month</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Calendar Stats */}
                {applications.length > 0 && (
                    <div className="mb-3 md:mb-4 px-1 md:px-2">
                        <div className="p-2 md:p-2.5 bg-muted/50 dark:bg-muted/30 rounded-lg border border-border/50">
                            <div className="flex items-center gap-1.5 mb-2">
                                <TrendingUp className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                                <span className="font-medium text-xs md:text-sm">Stats</span>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] md:text-xs text-muted-foreground">Upcoming</span>
                                    <span className="text-xs md:text-sm font-semibold text-foreground">{getUpcomingCount()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] md:text-xs text-muted-foreground">This Week</span>
                                    <span className="text-xs md:text-sm font-semibold text-foreground">{getThisWeekCount()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] md:text-xs text-muted-foreground">Total</span>
                                    <span className="text-xs md:text-sm font-semibold text-foreground">{applications.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mini Calendar */}
                <div className="mb-4 md:mb-5 px-1 md:px-2">
                    <div className="grid grid-cols-7 gap-0.5 md:gap-1 text-[10px] md:text-xs text-center mb-1.5 md:mb-2">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, index) => (
                            <div key={`day-${index}`} className="text-muted-foreground py-0.5 md:py-1">{d}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-0.5 md:gap-1 text-[11px] md:text-xs text-center">
                        {getMiniCalendarDays().map((dayInfo, i) => (
                            <button
                                key={i}
                                onClick={() => handleMiniCalendarClick(dayInfo.day, dayInfo.isCurrentMonth, dayInfo.isPrevMonth)}
                                className={cn(
                                    "h-6 w-6 md:h-7 md:w-7 flex items-center justify-center rounded-full hover:bg-accent transition-colors text-xs md:text-sm font-medium",
                                    dayInfo.isCurrentMonth ? "cursor-pointer text-foreground" : "cursor-pointer text-muted-foreground opacity-60 hover:opacity-100",
                                    dayInfo.isToday && "bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
                                )}
                            >
                                {dayInfo.day}
                            </button>
                        ))}
                    </div>
                </div>

                {/* My Calendars Section */}
                <div className="mb-3 md:mb-4">
                    <button
                        className="flex items-center justify-between w-full p-1.5 md:p-2 hover:bg-accent rounded-md mb-0.5 md:mb-1 transition-colors"
                        onClick={() => setIsMyCalendarsOpen(!isMyCalendarsOpen)}
                    >
                        <span className="font-medium text-xs md:text-sm">My calendars</span>
                        {isMyCalendarsOpen ? <ChevronUp className="h-3.5 w-3.5 md:h-4 md:w-4" /> : <ChevronDown className="h-3.5 w-3.5 md:h-4 md:w-4" />}
                    </button>

                    {isMyCalendarsOpen && (
                        <div className="space-y-1 md:space-y-1.5 mt-0.5 md:mt-1 px-1.5 md:px-2">
                            <div className="flex items-center gap-2 md:gap-2.5 group cursor-pointer py-0.5 md:py-1">
                                <Checkbox 
                                    id="tasks-cal" 
                                    checked={calendarTypes.tasks}
                                    onChange={(e) => handleCalendarTypeToggle('tasks', e)}
                                />
                                <label htmlFor="tasks-cal" className="text-xs md:text-sm font-normal cursor-pointer flex-1">Tasks</label>
                            </div>
                            <div className="flex items-center gap-2 md:gap-2.5 group cursor-pointer py-0.5 md:py-1">
                                <Checkbox 
                                    id="reminders-cal" 
                                    checked={calendarTypes.reminders}
                                    onChange={(e) => handleCalendarTypeToggle('reminders', e)}
                                />
                                <label htmlFor="reminders-cal" className="text-xs md:text-sm font-normal cursor-pointer flex-1">Reminders</label>
                            </div>
                            <div className="flex items-center gap-2 md:gap-2.5 group cursor-pointer py-0.5 md:py-1">
                                <Checkbox 
                                    id="apps-cal" 
                                    checked={calendarTypes.applications}
                                    onChange={(e) => handleCalendarTypeToggle('applications', e)}
                                />
                                <label htmlFor="apps-cal" className="text-xs md:text-sm font-normal cursor-pointer flex-1">Applications</label>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
