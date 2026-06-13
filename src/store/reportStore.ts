import { create } from 'zustand';
import type { Report, ShareSettings, ReportNote } from '@/types';
import { reports } from '@/data/reports';

interface ReportState {
  reports: Report[];
  currentReport: Report | null;
  setCurrentReport: (id: string) => void;
  createReport: (activityId: string, title: string) => Report;
  updateReport: (id: string, data: Partial<Report>) => void;
  addNote: (reportId: string, note: ReportNote) => void;
  deleteNote: (reportId: string, noteId: string) => void;
  shareReport: (id: string, settings: ShareSettings) => void;
}

export const useReportStore = create<ReportState>((set) => ({
  reports: reports,
  currentReport: null,
  setCurrentReport: (id: string) => set((state) => ({
    currentReport: state.reports.find((r) => r.id === id) || null,
  })),
  createReport: (activityId: string, title: string) => {
    const newReport: Report = {
      id: `r${Date.now()}`,
      activityId,
      title,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: '当前用户',
      sections: [],
      notes: [],
    };
    set((state) => ({
      reports: [...state.reports, newReport],
      currentReport: newReport,
    }));
    return newReport;
  },
  updateReport: (id: string, data: Partial<Report>) => set((state) => ({
    reports: state.reports.map((r) => r.id === id ? { ...r, ...data } : r),
    currentReport: state.currentReport?.id === id ? { ...state.currentReport, ...data } : state.currentReport,
  })),
  addNote: (reportId: string, note: ReportNote) => set((state) => ({
    reports: state.reports.map((r) => r.id === reportId ? { ...r, notes: [...r.notes, note] } : r),
    currentReport: state.currentReport?.id === reportId ? { ...state.currentReport, notes: [...state.currentReport.notes, note] } : state.currentReport,
  })),
  deleteNote: (reportId: string, noteId: string) => set((state) => ({
    reports: state.reports.map((r) => r.id === reportId ? { ...r, notes: r.notes.filter((n) => n.id !== noteId) } : r),
    currentReport: state.currentReport?.id === reportId ? { ...state.currentReport, notes: state.currentReport.notes.filter((n) => n.id !== noteId) } : state.currentReport,
  })),
  shareReport: (id: string, settings: ShareSettings) => set((state) => ({
    reports: state.reports.map((r) => r.id === id ? { ...r, shareSettings: settings } : r),
    currentReport: state.currentReport?.id === id ? { ...state.currentReport, shareSettings: settings } : state.currentReport,
  })),
}));