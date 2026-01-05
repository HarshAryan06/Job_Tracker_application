export const STORAGE_KEYS = {
  APPLICATIONS: 'jobtracker_applications',
  THEME: 'jobtracker_theme',
  DATE_NOTES: 'jobtracker_date_notes',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

