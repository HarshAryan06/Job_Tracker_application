'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    ChevronLeft,
    ChevronRight,
    Menu,
    Search,
    X
} from 'lucide-react';
import { cn } from '@/utils';

interface CalendarHeaderProps {
    currentDate: Date;
    onNavigate: (direction: 'prev' | 'next' | 'today' | Date) => void;
    onSearch: (query: string) => void;
    toggleSidebar: () => void;
    searchQuery?: string;
}

export function CalendarHeader({
    currentDate,
    onNavigate,
    onSearch,
    toggleSidebar,
    searchQuery = ''
}: CalendarHeaderProps) {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const shortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Generate years (current year ± 20 years)
    const currentYear = currentDate.getFullYear();
    const years = Array.from({ length: 41 }, (_, i) => currentYear - 20 + i);

    const handleMonthChange = (monthIndex: string) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(parseInt(monthIndex));
        onNavigate(newDate);
    };

    const handleYearChange = (year: string) => {
        const newDate = new Date(currentDate);
        newDate.setFullYear(parseInt(year));
        onNavigate(newDate);
    };

    return (
        <header className="flex flex-col md:flex-row items-stretch md:items-center justify-between px-2 sm:px-4 py-1.5 sm:py-2 border-b border-border bg-background md:h-16">
            {/* Mobile: Top row with menu, month/year, and nav */}
            <div className="flex items-center justify-between md:justify-start gap-1.5 sm:gap-2 md:gap-2 lg:gap-12 mb-1.5 sm:mb-2 md:mb-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-accent h-8 w-8 sm:h-9 sm:w-9 md:h-12 md:w-12 touch-manipulation active:scale-95"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleSidebar();
                        }}
                        type="button"
                    >
                        <Menu className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-foreground pointer-events-none" />
                    </Button>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        {/* Month Selector */}
                        <Select value={currentDate.getMonth().toString()} onValueChange={handleMonthChange}>
                            <SelectTrigger className="h-7 sm:h-8 md:h-9 px-2 sm:px-3 text-xs sm:text-sm md:text-base font-medium border-border hover:bg-accent w-fit min-w-[80px] sm:min-w-[100px] md:min-w-[120px]">
                                <SelectValue>
                                    <span className="hidden sm:inline">{monthNames[currentDate.getMonth()]}</span>
                                    <span className="sm:hidden">{shortMonthNames[currentDate.getMonth()]}</span>
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {monthNames.map((month, index) => (
                                    <SelectItem key={index} value={index.toString()}>
                                        {month}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Year Selector */}
                        <Select value={currentDate.getFullYear().toString()} onValueChange={handleYearChange}>
                            <SelectTrigger className="h-7 sm:h-8 md:h-9 px-2 sm:px-3 text-xs sm:text-sm md:text-base font-medium border-border hover:bg-accent w-fit min-w-[70px] sm:min-w-[80px]">
                                <SelectValue>{currentDate.getFullYear()}</SelectValue>
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px]">
                                {years.map((year) => (
                                    <SelectItem key={year} value={year.toString()}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-1 md:gap-2 lg:gap-4">
                    <Button
                        variant="outline"
                        className="px-2 sm:px-3 md:px-6 h-7 sm:h-8 md:h-9 rounded-md border-border hover:bg-accent text-[10px] sm:text-xs md:text-sm font-medium touch-manipulation"
                        onClick={() => onNavigate('today')}
                    >
                        <span className="hidden sm:inline">Today</span>
                        <span className="sm:hidden">Today</span>
                    </Button>
                    <div className="flex items-center gap-0.5 md:gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full h-7 w-7 sm:h-8 sm:w-8 touch-manipulation"
                            onClick={() => onNavigate('prev')}
                        >
                            <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full h-7 w-7 sm:h-8 sm:w-8 touch-manipulation"
                            onClick={() => onNavigate('next')}
                        >
                            <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile: Search bar below */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 w-full md:w-auto">
                <div className="flex relative w-full md:max-w-[720px] bg-accent/30 rounded-lg focus-within:bg-background focus-within:shadow-md transition-all">
                    <div className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                    </div>
                    <Input
                        placeholder="Search..."
                        className="border-none bg-transparent h-8 sm:h-9 md:h-12 pl-7 sm:pl-9 md:pl-12 pr-7 sm:pr-8 md:pr-10 text-xs sm:text-sm md:text-base focus-visible:ring-0 w-full"
                        onChange={(e) => onSearch(e.target.value)}
                        value={searchQuery}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => onSearch('')}
                            className="absolute right-1.5 sm:right-2 md:right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 sm:p-1 rounded-full hover:bg-accent touch-manipulation"
                            aria-label="Clear search"
                        >
                            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
