export enum ApplicationStatus {
  APPLIED = 'Applied',
  PENDING = 'Pending Interview',
  INTERVIEWING = 'Interviewing',
  OFFER = 'Offer Received',
  REJECTED = 'Rejected',
  GHOSTED = 'Ghosted'
}

export interface Application {
  id: string;
  companyName: string;
  role: string;
  location: string;
  dateApplied: string;
  status: ApplicationStatus;
  resumeName: string;
  resumeFile?: {
    name: string;
    data: string;
    type: string;
  };
  notes: string;
  jobDescription: string;
  salaryRange?: string;
}

export interface DateNote {
  date: string; // ISO date string (YYYY-MM-DD)
  note: string;
  applications?: string[]; // Application IDs linked to this date
}

export interface DashboardStats {
  total: number;
  interviews: number;
  offers: number;
  pending: number;
  rejected: number;
  applied: number;
}

export type ViewType = 'dashboard' | 'list' | 'add' | 'details';

