'use client';

import React, { useState } from 'react';
import { Application, DateNote } from '@/types';
import { CalendarHeader } from './calendar-header';
import { CalendarSidebar } from './calendar-sidebar';
import { MonthView } from './month-view';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/utils';

interface GoogleCalendarLayoutProps {
    currentDate: Date;
    onNavigate: (direction: 'prev' | 'next' | 'today' | Date) => void;
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
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleToggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleToggleMobileSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-280px)] sm:h-[calc(100vh-240px)] md:h-[calc(100vh-180px)] bg-background border border-border rounded-lg overflow-hidden shadow-sm">
            <CalendarHeader
                currentDate={currentDate}
                onNavigate={onNavigate}
                onSearch={setSearchQuery}
                toggleSidebar={handleToggleMobileSidebar}
                searchQuery={searchQuery}
            />

            <div className="flex flex-1 overflow-hidden">
                {/* Desktop Sidebar */}
                <CalendarSidebar
                    className={cn(
                        "hidden md:flex transition-all duration-300 ease-in-out",
                        !isSidebarOpen && "w-0 -ml-[1px] opacity-0 overflow-hidden px-0"
                    )}
                    onDateClick={onDateClick}
                    currentDate={currentDate}
                    onNavigate={(date) => {
                        if (date instanceof Date) {
                            onNavigate(date);
                        }
                    }}
                    applications={applications}
                />

                {/* Mobile Sidebar Drawer */}
                <Dialog open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
                    <DialogContent
                        className="md:hidden fixed left-0 top-0 bottom-0 h-full w-[280px] max-w-[85vw] translate-x-[-100%] translate-y-0 rounded-none rounded-r-lg p-0 border-r shadow-xl data-[state=closed]:translate-x-[-100%] data-[state=open]:translate-x-0 transition-transform duration-300 ease-in-out z-[60]"
                        showCloseButton={true}
                    >
                        <DialogTitle className="sr-only">Calendar Sidebar</DialogTitle>
                        <div className="h-full overflow-y-auto">
                            <CalendarSidebar
                                className="w-full"
                                onDateClick={(date) => {
                                    onDateClick(date);
                                    setIsMobileSidebarOpen(false);
                                }}
                                currentDate={currentDate}
                                onNavigate={(date) => {
                                    if (date instanceof Date) {
                                        onNavigate(date);
                                        setIsMobileSidebarOpen(false);
                                    }
                                }}
                                applications={applications}
                            />
                        </div>
                    </DialogContent>
                </Dialog>

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
