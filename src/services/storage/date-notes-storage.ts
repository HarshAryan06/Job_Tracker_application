import { DateNote } from '@/types';
import { STORAGE_KEYS } from '@/constants/storage-keys';

export class DateNotesStorageService {
  private static readonly KEY = STORAGE_KEYS.DATE_NOTES;

  static load(): DateNote[] {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(this.KEY);
    return saved ? (JSON.parse(saved) as DateNote[]) : [];
  }

  static save(notes: DateNote[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.KEY, JSON.stringify(notes));
  }

  static getNoteByDate(date: string): DateNote | undefined {
    const notes = this.load();
    return notes.find(note => note.date === date);
  }

  static saveNote(note: DateNote): void {
    const notes = this.load();
    const existingIndex = notes.findIndex(n => n.date === note.date);
    if (existingIndex >= 0) {
      notes[existingIndex] = note;
    } else {
      notes.push(note);
    }
    this.save(notes);
  }

  static deleteNote(date: string): void {
    const notes = this.load();
    const filtered = notes.filter(n => n.date !== date);
    this.save(filtered);
  }

  static clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.KEY);
  }
}

