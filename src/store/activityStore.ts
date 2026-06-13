import { create } from 'zustand';
import type { Activity } from '@/types';
import { activities, currentActivity } from '@/data/activities';

interface ActivityState {
  currentActivity: Activity | null;
  activities: Activity[];
  setCurrentActivity: (id: string) => void;
  updateActivity: (id: string, data: Partial<Activity>) => void;
}

export const useActivityStore = create<ActivityState>((set) => ({
  currentActivity: currentActivity,
  activities: activities,
  setCurrentActivity: (id: string) => set((state) => ({
    currentActivity: state.activities.find((a) => a.id === id) || null,
  })),
  updateActivity: (id: string, data: Partial<Activity>) => set((state) => ({
    activities: state.activities.map((a) => a.id === id ? { ...a, ...data } : a),
    currentActivity: state.currentActivity?.id === id ? { ...state.currentActivity, ...data } : state.currentActivity,
  })),
}));