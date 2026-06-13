import { create } from 'zustand';
import type { Report, ShareSettings, ReportNote, ReportSection } from '@/types';
import { reports as initialReports } from '@/data/reports';

const REPORTS_STORAGE_KEY = 'activity_reports_data';

interface StoredReportsData {
  reports: Report[];
}

function loadReportsFromStorage(): Report[] | null {
  try {
    const stored = localStorage.getItem(REPORTS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load reports from localStorage:', e);
  }
  return null;
}

function saveReportsToStorage(reports: Report[]): void {
  try {
    localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
  } catch (e) {
    console.error('Failed to save reports to localStorage:', e);
  }
}

const defaultSections: ReportSection[] = [
  { type: 'metrics', title: '核心指标概览', enabled: true },
  { type: 'channel', title: '渠道效果对比', enabled: true },
  { type: 'funnel', title: '转化漏斗分析', enabled: true },
  { type: 'survey', title: '问卷反馈汇总', enabled: true },
  { type: 'notes', title: '复盘备注', enabled: true },
];

const storedReports = loadReportsFromStorage();
const initialReportsData = storedReports || initialReports;

interface ReportState {
  reports: Report[];
  currentReport: Report | null;
  
  setCurrentReport: (id: string | null) => void;
  createReport: (activityId: string, title: string, sections: ReportSection[]) => Report;
  updateReport: (id: string, data: Partial<Report>) => void;
  addNote: (reportId: string, note: ReportNote) => void;
  deleteNote: (reportId: string, noteId: string) => void;
  shareReport: (id: string, settings: ShareSettings) => void;
  getReportByShareLink: (link: string) => Report | null;
}

export const useReportStore = create<ReportState>((set, get) => ({
  reports: initialReportsData,
  currentReport: null,

  setCurrentReport: (id: string | null) => {
    if (!id) {
      set({ currentReport: null });
      return;
    }
    const report = get().reports.find((r) => r.id === id);
    set({ currentReport: report || null });
  },

  createReport: (activityId: string, title: string, sections: ReportSection[]) => {
    const newReport: Report = {
      id: `r${Date.now()}`,
      activityId,
      title,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: '当前用户',
      sections: sections.length > 0 ? sections : defaultSections,
      notes: [],
    };
    set((state) => {
      const newReports = [...state.reports, newReport];
      saveReportsToStorage(newReports);
      return { reports: newReports, currentReport: newReport };
    });
    return newReport;
  },

  updateReport: (id: string, data: Partial<Report>) => {
    set((state) => {
      const newReports = state.reports.map((r) => (r.id === id ? { ...r, ...data } : r));
      saveReportsToStorage(newReports);
      return {
        reports: newReports,
        currentReport: state.currentReport?.id === id ? { ...state.currentReport, ...data } : state.currentReport,
      };
    });
  },

  addNote: (reportId: string, note: ReportNote) => {
    set((state) => {
      const newReports = state.reports.map((r) =>
        r.id === reportId ? { ...r, notes: [...r.notes, note] } : r
      );
      saveReportsToStorage(newReports);
      return {
        reports: newReports,
        currentReport: state.currentReport?.id === reportId
          ? { ...state.currentReport, notes: [...state.currentReport.notes, note] }
          : state.currentReport,
      };
    });
  },

  deleteNote: (reportId: string, noteId: string) => {
    set((state) => {
      const newReports = state.reports.map((r) =>
        r.id === reportId ? { ...r, notes: r.notes.filter((n) => n.id !== noteId) } : r
      );
      saveReportsToStorage(newReports);
      return {
        reports: newReports,
        currentReport: state.currentReport?.id === reportId
          ? { ...state.currentReport, notes: state.currentReport.notes.filter((n) => n.id !== noteId) }
          : state.currentReport,
      };
    });
  },

  shareReport: (id: string, settings: ShareSettings) => {
    set((state) => {
      const newReports = state.reports.map((r) => (r.id === id ? { ...r, shareSettings: settings } : r));
      saveReportsToStorage(newReports);
      return {
        reports: newReports,
        currentReport: state.currentReport?.id === id
          ? { ...state.currentReport, shareSettings: settings }
          : state.currentReport,
      };
    });
  },

  getReportByShareLink: (link: string) => {
    const report = get().reports.find((r) => r.shareSettings?.link === link);
    if (!report) return null;
    
    if (report.shareSettings?.expiresAt) {
      const today = new Date().toISOString().split('T')[0];
      if (report.shareSettings.expiresAt < today) {
        return null;
      }
    }
    
    return report;
  },
}));