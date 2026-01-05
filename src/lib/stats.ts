import { Application, ApplicationStatus, DashboardStats } from '@/types';

export const calculateStats = (applications: Application[]): DashboardStats => ({
  total: applications.length,
  interviews: applications.filter(a => a.status === ApplicationStatus.INTERVIEWING).length,
  offers: applications.filter(a => a.status === ApplicationStatus.OFFER).length,
  pending: applications.filter(a => a.status === ApplicationStatus.PENDING).length,
  rejected: applications.filter(a => a.status === ApplicationStatus.REJECTED).length,
  applied: applications.filter(a => a.status === ApplicationStatus.APPLIED).length,
});

export const calculateProgressPercentage = (stats: DashboardStats): number => {
  return stats.total > 0 ? Math.round((stats.interviews / stats.total) * 100) : 0;
};

export const filterApplications = (
  applications: Application[],
  searchTerm: string,
  statusFilter: string
): Application[] => {
  let result = applications;

  if (statusFilter !== 'All') {
    result = result.filter(app => app.status === statusFilter);
  }

  if (searchTerm) {
    const lower = searchTerm.toLowerCase();
    result = result.filter(app =>
      app.companyName.toLowerCase().includes(lower) ||
      app.role.toLowerCase().includes(lower)
    );
  }

  return result;
};

