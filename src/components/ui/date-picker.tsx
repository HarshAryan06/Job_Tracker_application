'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, CalendarIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils';

interface DatePickerProps {
  value?: string; // ISO date string (YYYY-MM-DD)
  onChange?: (value: string) => void;
  max?: string; // ISO date string (YYYY-MM-DD)
  className?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

// Internal calendar component
function DatePickerCalendar({ value, onChange, max, onClose, className }: DatePickerProps & { onClose?: () => void }) {
  const selectedDate = React.useMemo(() => {
    return value ? new Date(value) : null;
  }, [value]);

  const [currentMonth, setCurrentMonth] = React.useState<number>(
    selectedDate ? selectedDate.getMonth() : new Date().getMonth()
  );
  const [currentYear, setCurrentYear] = React.useState<number>(
    selectedDate ? selectedDate.getFullYear() : new Date().getFullYear()
  );

  // Sync current month/year when value changes
  React.useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(selectedDate.getMonth());
      setCurrentYear(selectedDate.getFullYear());
    }
  }, [selectedDate]);

  const today = new Date();
  const maxDate = max ? new Date(max) : null;

  // Generate years (current year ± 10 years)
  const years = React.useMemo(() => {
    const currentYearNum = today.getFullYear();
    const yearList: number[] = [];
    for (let i = currentYearNum - 10; i <= currentYearNum + 10; i++) {
      yearList.push(i);
    }
    return yearList;
  }, []);

  // Get days in month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days
  const calendarDays = React.useMemo(() => {
    const days: Array<{ day: number; isCurrentMonth: boolean; isPrevMonth: boolean; date: Date }> = [];
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const daysInPrevMonth = getDaysInMonth(prevMonth, prevYear);

    // Add previous month's trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      days.push({
        day,
        isCurrentMonth: false,
        isPrevMonth: true,
        date: new Date(prevYear, prevMonth, day)
      });
    }

    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        isPrevMonth: false,
        date: new Date(currentYear, currentMonth, day)
      });
    }

    // Add next month's leading days to fill the grid
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isPrevMonth: false,
        date: new Date(nextYear, nextMonth, day)
      });
    }

    return days;
  }, [currentMonth, currentYear]);

  const handleDateClick = (date: Date) => {
    // Check if date is in the future (if max is set)
    if (maxDate && date > maxDate) {
      return;
    }
    const isoDate = date.toISOString().split('T')[0];
    onChange?.(isoDate);
    onClose?.();
  };

  const handleMonthChange = (monthIndex: number) => {
    setCurrentMonth(monthIndex);
  };

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleToday = () => {
    const todayDate = new Date();
    if (maxDate && todayDate > maxDate) {
      return;
    }
    setCurrentMonth(todayDate.getMonth());
    setCurrentYear(todayDate.getFullYear());
    const isoDate = todayDate.toISOString().split('T')[0];
    onChange?.(isoDate);
  };

  const handleClear = () => {
    onChange?.('');
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isToday = (date: Date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isDateDisabled = (date: Date) => {
    if (maxDate && date > maxDate) return true;
    return false;
  };

  return (
    <div className={cn('bg-popover text-popover-foreground rounded-lg border border-border p-3 w-full max-w-[280px]', className)}>
      {/* Header with Year and Month Dropdowns */}
      <div className="flex items-center justify-center mb-2.5">
        <div className="flex items-center gap-2.5">
          <Select
            value={currentYear.toString()}
            onValueChange={(val) => handleYearChange(parseInt(val))}
          >
            <SelectTrigger 
              className="h-8 px-3 min-w-[85px] text-sm font-semibold bg-background hover:bg-accent/80 border-2 border-border hover:border-primary/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 transition-all duration-200 shadow-sm hover:shadow-md"
              size="sm"
            >
              <SelectValue>
                <span className="text-foreground font-semibold">{currentYear}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()} className="cursor-pointer text-sm font-medium">
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={currentMonth.toString()}
            onValueChange={(val) => handleMonthChange(parseInt(val))}
          >
            <SelectTrigger 
              className="h-8 px-3 min-w-[120px] text-sm font-semibold bg-background hover:bg-accent/80 border-2 border-border hover:border-primary/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 transition-all duration-200 shadow-sm hover:shadow-md"
              size="sm"
            >
              <SelectValue>
                <span className="text-foreground font-semibold">{MONTHS[currentMonth]}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
              {MONTHS.map((month, index) => (
                <SelectItem key={month} value={index.toString()} className="cursor-pointer text-sm font-medium">
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-center gap-2 mb-2.5">
        <button
          onClick={handlePrevMonth}
          className="h-7 w-7 flex items-center justify-center hover:bg-accent rounded-md transition-colors duration-200 border border-transparent hover:border-border"
          type="button"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-3.5 w-3.5 text-foreground" />
        </button>
        <span className="text-sm font-bold text-foreground min-w-[120px] text-center">
          {MONTHS[currentMonth]} {currentYear}
        </span>
        <button
          onClick={handleNextMonth}
          className="h-7 w-7 flex items-center justify-center hover:bg-accent rounded-md transition-colors duration-200 border border-transparent hover:border-border"
          type="button"
          aria-label="Next month"
        >
          <ChevronRight className="h-3.5 w-3.5 text-foreground" />
        </button>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-0.5 mb-1.5">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="text-[10px] font-medium text-muted-foreground text-center py-0.5"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0.5 mb-3">
        {calendarDays.map((dayInfo, index) => {
          const isSelected = isDateSelected(dayInfo.date);
          const isTodayDate = isToday(dayInfo.date);
          const isDisabled = isDateDisabled(dayInfo.date);

          return (
            <button
              key={index}
              onClick={() => handleDateClick(dayInfo.date)}
              disabled={isDisabled}
              className={cn(
                'h-8 w-8 rounded-md text-xs font-medium transition-colors',
                {
                  'text-muted-foreground/60': !dayInfo.isCurrentMonth || isDisabled,
                  'text-foreground': dayInfo.isCurrentMonth && !isSelected && !isDisabled,
                  'bg-primary text-primary-foreground': isSelected,
                  'hover:bg-accent hover:text-accent-foreground': !isSelected && !isDisabled && dayInfo.isCurrentMonth,
                  'cursor-not-allowed opacity-50': isDisabled,
                  'cursor-pointer': !isDisabled,
                }
              )}
              type="button"
            >
              {dayInfo.day}
            </button>
          );
        })}
      </div>

      {/* Footer Buttons */}
      <div className="flex items-center justify-between pt-1.5 border-t border-border">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="text-xs h-7 px-3"
        >
          Clear
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleToday}
          className="text-xs h-7 px-3"
        >
          Today
        </Button>
      </div>
    </div>
  );
}

// Main DatePicker component with input and popover
export function DatePicker({ value, onChange, max, className }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const dateUtils = React.useMemo(() => {
    const formatDate = (dateStr: string): string => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };
    return { formatDate };
  }, []);

  const displayValue = value ? dateUtils.formatDate(value) : '';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'w-full h-10 rounded-lg border-2 bg-transparent px-4 py-2 text-sm text-left flex items-center gap-2 relative',
            'hover:border-primary/30 hover:shadow-md transition-all duration-300',
            'focus-visible:border-primary/50 focus-visible:ring-primary/20 focus-visible:ring-[3px] focus-visible:shadow-lg focus-visible:shadow-primary/5',
            'input-animated input-focus-glow',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <span className="flex-1">{displayValue || 'Pick a date'}</span>
          <CalendarIcon className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-0 shadow-lg" align="start">
        <DatePickerCalendar
          value={value}
          onChange={(newValue) => {
            onChange?.(newValue);
            if (newValue) {
              setOpen(false);
            }
          }}
          max={max}
          onClose={() => setOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
}

