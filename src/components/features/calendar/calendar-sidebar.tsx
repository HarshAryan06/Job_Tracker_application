'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/utils';
import { useRouter } from 'next/navigation';

interface CalendarSidebarProps {
    className?: string;
    onDateClick?: (date: Date) => void;
    currentDate?: Date;
    onCalendarTypeChange?: (type: 'tasks' | 'reminders' | 'applications', enabled: boolean) => void;
}

export function CalendarSidebar({ className, onDateClick, currentDate = new Date(), onCalendarTypeChange }: CalendarSidebarProps) {
    const [isMyCalendarsOpen, setIsMyCalendarsOpen] = useState(true);
    const [calendarTypes, setCalendarTypes] = useState({
        tasks: true,
        reminders: true,
        applications: true
    });
    const router = useRouter();

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
        <aside className={cn("w-64 flex flex-col p-3 gap-6 h-full bg-background border-r border-border", className)}>
            <div className="pl-1">
                <Button
                    className="rounded-full h-14 pl-3 pr-6 shadow-md bg-background dark:bg-card hover:bg-accent text-foreground border border-border/10 hover:shadow-lg transition-all"
                    variant="outline"
                    onClick={handleCreate}
                >
                    <div className="flex items-center gap-3">
                        <Plus className="h-9 w-9 p-1.5" />
                        <span className="font-medium text-base">Create</span>
                    </div>
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {/* Mini Calendar */}
                <div className="mb-6 px-2">
                    <div className="grid grid-cols-7 gap-1 text-xs text-center mb-2">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                            <div key={d} className="text-muted-foreground py-1">{d}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-sm text-center">
                        {getMiniCalendarDays().map((dayInfo, i) => (
                            <button
                                key={i}
                                onClick={() => handleMiniCalendarClick(dayInfo.day, dayInfo.isCurrentMonth, dayInfo.isPrevMonth)}
                                className={cn(
                                    "h-7 w-7 flex items-center justify-center rounded-full hover:bg-accent transition-colors",
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
                <div className="mb-4">
                    <button
                        className="flex items-center justify-between w-full p-2 hover:bg-accent rounded-md mb-1"
                        onClick={() => setIsMyCalendarsOpen(!isMyCalendarsOpen)}
                    >
                        <span className="font-medium text-sm">My calendars</span>
                        {isMyCalendarsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>

                    {isMyCalendarsOpen && (
                        <div className="space-y-2 mt-1 px-2">
                            <div className="flex items-center gap-3 group cursor-pointer py-1">
                                <Checkbox 
                                    id="tasks-cal" 
                                    checked={calendarTypes.tasks}
                                    onChange={(e) => handleCalendarTypeToggle('tasks', e)}
                                />
                                <label htmlFor="tasks-cal" className="text-sm font-normal cursor-pointer flex-1">Tasks</label>
                            </div>
                            <div className="flex items-center gap-3 group cursor-pointer py-1">
                                <Checkbox 
                                    id="reminders-cal" 
                                    checked={calendarTypes.reminders}
                                    onChange={(e) => handleCalendarTypeToggle('reminders', e)}
                                />
                                <label htmlFor="reminders-cal" className="text-sm font-normal cursor-pointer flex-1">Reminders</label>
                            </div>
                            <div className="flex items-center gap-3 group cursor-pointer py-1">
                                <Checkbox 
                                    id="apps-cal" 
                                    checked={calendarTypes.applications}
                                    onChange={(e) => handleCalendarTypeToggle('applications', e)}
                                />
                                <label htmlFor="apps-cal" className="text-sm font-normal cursor-pointer flex-1">Applications</label>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="text-xs text-muted-foreground text-center py-4 border-t border-border">
                InterviewVault Tracker
            </div>
        </aside>
    );
}
