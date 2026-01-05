'use client';

import React, { useState } from 'react';
import { Application, DateNote } from '@/types';
import { CalendarHeader } from './calendar-header';
import { CalendarSidebar } from './calendar-sidebar';
import { MonthView } from './month-view';
import { cn } from '@/utils';

interface GoogleCalendarLayoutProps {
    currentDate: Date;
    onNavigate: (direction: 'prev' | 'next' | 'today') => void;
    applications: Application[];
    dateNotes: DateNote[];
    onDateClick: (date: Date) => void;
}

export function GoogleCalendarLayout({
    currentDate,
    onNavigate,
    applications,
    dateNotes,
    onDateClick
}: GoogleCalendarLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter functionality could be implemented here or passed up
    // For visual clone, we'll just accept props

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] sm:h-[calc(100vh-160px)] md:h-[calc(100vh-180px)] bg-background border border-border rounded-lg overflow-hidden shadow-sm">
            <CalendarHeader
                currentDate={currentDate}
                onNavigate={onNavigate}
                onSearch={setSearchQuery}
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                searchQuery={searchQuery}
            />

            <div className="flex flex-1 overflow-hidden">
                <CalendarSidebar
                    className={cn(
                        "hidden md:flex transition-all duration-300 ease-in-out",
                        !isSidebarOpen && "w-0 -ml-[1px] opacity-0 overflow-hidden px-0"
                    )}
                    onDateClick={onDateClick}
                    currentDate={currentDate}
                />

                <main className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden">
                    <MonthView
                        currentDate={currentDate}
                        applications={applications}
                        dateNotes={dateNotes}
                        onDateClick={onDateClick}
                        searchQuery={searchQuery}
                    />
                </main>
            </div>
        </div>
    );
}
