'use client';

import { useState, useMemo, useEffect } from 'react';
import { useApplications } from '@/hooks';
import { DateNotesStorageService } from '@/services/storage';
import { DateNote } from '@/types';
import { dateUtils } from '@/utils/date';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Calendar as CalendarIcon, Plus, X, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { GoogleCalendarLayout } from '@/components/features/calendar/google-calendar-layout';

export default function CalendarPage() {
  const { applications, isLoaded } = useApplications();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dateNotes, setDateNotes] = useState<DateNote[]>([]);
  const [selectedNote, setSelectedNote] = useState<DateNote | null>(null);
  const [noteText, setNoteText] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      setDateNotes(DateNotesStorageService.load());
    }
  }, [isLoaded]);

  // Get applications for a specific date
  const getApplicationsForDate = (date: Date | null) => {
    if (!date) return [];
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    return applications.filter(app => {
      try {
        // Try to parse the stored date format (could be "Jan 15, 2025" or ISO string)
        const appDate = new Date(app.dateApplied);
        appDate.setHours(0, 0, 0, 0);

        return appDate.getTime() === targetDate.getTime();
      } catch {
        // If parsing fails, try string comparison as fallback
        const dateStr = dateUtils.formatDate(date);
        return app.dateApplied === dateStr ||
          app.dateApplied.includes(dateStr.split(',')[0].trim());
      }
    });
  };

  // Get note for a specific date
  const getNoteForDate = (date: Date | null): DateNote | undefined => {
    if (!date) return undefined;
    const isoDate = dateUtils.formatISO(date);
    return dateNotes.find(note => note.date === isoDate);
  };


  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const isoDate = dateUtils.formatISO(date);
    const existingNote = dateNotes.find(note => note.date === isoDate);

    if (existingNote) {
      setSelectedNote(existingNote);
      setNoteText(existingNote.note);
    } else {
      setSelectedNote(null);
      setNoteText('');
    }

    setIsDialogOpen(true);
  };

  const handleSaveNote = () => {
    if (!selectedDate) return;
    const isoDate = dateUtils.formatISO(selectedDate);
    const dateApps = getApplicationsForDate(selectedDate);

    const note: DateNote = {
      date: isoDate,
      note: noteText,
      applications: dateApps.map(app => app.id),
    };

    DateNotesStorageService.saveNote(note);
    setDateNotes(prev => {
      const filtered = prev.filter(n => n.date !== isoDate);
      return [...filtered, note];
    });

    toast.success('Note saved');
    setIsDialogOpen(false);
  };

  const handleDeleteNote = () => {
    if (!selectedNote || !selectedDate) return;
    const isoDate = dateUtils.formatISO(selectedDate);
    DateNotesStorageService.deleteNote(isoDate);
    setDateNotes(prev => prev.filter(n => n.date !== isoDate));
    setSelectedNote(null);
    setNoteText('');
    toast.success('Note deleted');
    setIsDialogOpen(false);
  };

  const navigateMonth = (direction: 'prev' | 'next' | 'today' | Date) => {
    if (direction === 'today') {
      setCurrentDate(new Date());
    } else if (direction instanceof Date) {
      setCurrentDate(direction);
    } else {
      setCurrentDate(prev => {
        const newDate = new Date(prev);
        if (direction === 'prev') {
          newDate.setMonth(prev.getMonth() - 1);
        } else {
          newDate.setMonth(prev.getMonth() + 1);
        }
        return newDate;
      });
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const selectedDateApps = useMemo(() => {
    return selectedDate ? getApplicationsForDate(selectedDate) : [];
  }, [selectedDate, applications]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-4 md:space-y-6 animate-in fade-in duration-500 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground mt-0.5 sm:mt-1 text-xs sm:text-sm md:text-base hidden sm:block">View your applications and add notes</p>
        </div>
      </div>

      <GoogleCalendarLayout
        currentDate={currentDate}
        onNavigate={(direction) => {
          if (direction === 'today') {
            goToToday();
          } else if (direction instanceof Date) {
            setCurrentDate(direction);
          } else {
            navigateMonth(direction);
          }
        }}
        applications={applications}
        dateNotes={dateNotes}
        onDateClick={handleDateClick}
      />

      {/* Selected Date Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[calc(100vw-2rem)] sm:w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              {selectedDate && dateUtils.formatDate(selectedDate)}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Add notes and view applications for this date
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Applications for this date */}
            {selectedDateApps.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs sm:text-sm font-semibold flex items-center gap-2">
                  <Briefcase className="h-3 w-3 sm:h-4 sm:w-4" />
                  Applications ({selectedDateApps.length})
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedDateApps.map(app => (
                    <Link
                      key={app.id}
                      href={`/applications/${app.id}`}
                      className="block"
                    >
                      <Card className="p-2 sm:p-3 hover:border-primary/50 transition-colors cursor-pointer touch-manipulation">
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm font-bold truncate">{app.companyName}</p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{app.role}</p>
                          </div>
                          <Badge variant="secondary" className="text-[10px] sm:text-xs shrink-0">
                            {app.status}
                          </Badge>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Notes section */}
            <div className="space-y-2">
              <h4 className="text-xs sm:text-sm font-semibold">Notes</h4>
              <Textarea
                placeholder="Add notes about interviews, follow-ups, or any important details for this date..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={6}
                className="resize-none text-sm"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <div className="w-full sm:w-auto">
              {selectedNote && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeleteNote}
                  className="text-destructive hover:text-destructive w-full sm:w-auto touch-manipulation"
                >
                  <X className="h-4 w-4 mr-2" />
                  Delete Note
                </Button>
              )}
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1 sm:flex-initial touch-manipulation"
              >
                Cancel
              </Button>
              <Button onClick={handleSaveNote} variant="gradient" className="flex-1 sm:flex-initial touch-manipulation">
                <Plus className="h-4 w-4 mr-2" />
                Save Note
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

