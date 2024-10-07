import { create } from 'zustand';

export interface SummaryData {
  jobsPosted: number;
  agenciesRegistered: number;
  usersRegistered: number;
  employers: number;
}

interface JobSummaryData {
  posted: number;
  applied: number;
  expired: number;
  agencies: number;
}

interface InsightsData {
  appDownloads: number[];
  jobs: number[];
  sitePerformance: number[];
}

interface DashboardStore {
  summaryData: SummaryData;
  jobSummaryData: JobSummaryData;
  insightsData: InsightsData;
  updateSummaryData: (newSummaryData: Partial<SummaryData>) => void;
  updateJobSummaryData: (newJobSummaryData: Partial<JobSummaryData>) => void;
  updateInsightsData: (newInsightsData: Partial<InsightsData>) => void;
}

const useDashboardStore = create<DashboardStore>((set) => ({
  summaryData: {
    jobsPosted: 12415,
    agenciesRegistered: 116,
    usersRegistered: 27362,
    employers: 28,
  },
  jobSummaryData: {
    posted: 12415,
    applied: 5263,
    expired: 241,
    agencies: 116,
  },
  insightsData: {
    appDownloads: [500, 1000, 1500, 2000, 3000, 4000, 3500, 2500, 2000, 1500, 1000, 500],
    jobs: [5263, 12415],
    sitePerformance: [12384, 7283, 1456, 4910],
  },
  updateSummaryData: (newSummaryData) =>
    set((state) => ({
      summaryData: { ...state.summaryData, ...newSummaryData },
    })),
  updateJobSummaryData: (newJobSummaryData) =>
    set((state) => ({
      jobSummaryData: { ...state.jobSummaryData, ...newJobSummaryData },
    })),
  updateInsightsData: (newInsightsData) =>
    set((state) => ({
      insightsData: { ...state.insightsData, ...newInsightsData },
    })),
}));

export default useDashboardStore;
