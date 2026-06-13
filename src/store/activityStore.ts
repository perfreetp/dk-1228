import { create } from 'zustand';
import type { Activity, Channel, ChannelType, ActivityTarget } from '@/types';
import { activities, currentActivity } from '@/data/activities';

const STORAGE_KEY = 'activity_analytics_data';

interface StoredActivityData {
  activities: Activity[];
  currentActivityId: string;
}

function loadFromStorage(): StoredActivityData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load from localStorage:', e);
  }
  return null;
}

function saveToStorage(data: StoredActivityData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

const storedData = loadFromStorage();
const initialActivities = storedData?.activities || activities;
const initialCurrentId = storedData?.currentActivityId || currentActivity?.id || 'a1';

interface ActivityState {
  currentActivity: Activity | null;
  activities: Activity[];
  isEditing: boolean;
  editingActivity: Activity | null;
  
  setCurrentActivity: (id: string) => void;
  updateActivity: (id: string, data: Partial<Activity>) => void;
  addActivity: (activity: Activity) => void;
  
  startEditing: () => void;
  cancelEditing: () => void;
  saveEditing: () => void;
  updateEditingField: <K extends keyof Activity>(field: K, value: Activity[K]) => void;
  updateEditingTarget: <K extends keyof ActivityTarget>(field: K, value: ActivityTarget[K]) => void;
  
  addChannel: (channel: Omit<Channel, 'id'>) => void;
  updateChannel: (channelId: string, data: Partial<Channel>) => void;
  deleteChannel: (channelId: string) => void;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  currentActivity: initialActivities.find((a) => a.id === initialCurrentId) || initialActivities[0],
  activities: initialActivities,
  isEditing: false,
  editingActivity: null,

  setCurrentActivity: (id: string) => {
    const activity = get().activities.find((a) => a.id === id);
    if (activity) {
      set({ currentActivity: activity });
    }
  },

  updateActivity: (id: string, data: Partial<Activity>) => {
    set((state) => {
      const newActivities = state.activities.map((a) => (a.id === id ? { ...a, ...data } : a));
      const newCurrent = state.currentActivity?.id === id ? { ...state.currentActivity, ...data } : state.currentActivity;
      saveToStorage({ activities: newActivities, currentActivityId: state.currentActivity?.id || id });
      return { activities: newActivities, currentActivity: newCurrent };
    });
  },

  addActivity: (activity: Activity) => {
    set((state) => {
      const newActivities = [...state.activities, activity];
      saveToStorage({ activities: newActivities, currentActivityId: state.currentActivity?.id || activity.id });
      return { activities: newActivities };
    });
  },

  startEditing: () => {
    const current = get().currentActivity;
    if (current) {
      set({ isEditing: true, editingActivity: JSON.parse(JSON.stringify(current)) });
    }
  },

  cancelEditing: () => {
    set({ isEditing: false, editingActivity: null });
  },

  saveEditing: () => {
    const { editingActivity } = get();
    if (editingActivity) {
      set((state) => {
        const newActivities = state.activities.map((a) => (a.id === editingActivity.id ? editingActivity : a));
        saveToStorage({ activities: newActivities, currentActivityId: editingActivity.id });
        return {
          activities: newActivities,
          currentActivity: editingActivity,
          isEditing: false,
          editingActivity: null,
        };
      });
    }
  },

  updateEditingField: (field, value) => {
    set((state) => {
      if (!state.editingActivity) return state;
      return { editingActivity: { ...state.editingActivity, [field]: value } };
    });
  },

  updateEditingTarget: (field, value) => {
    set((state) => {
      if (!state.editingActivity) return state;
      return {
        editingActivity: {
          ...state.editingActivity,
          target: { ...state.editingActivity.target, [field]: value },
        },
      };
    });
  },

  addChannel: (channelData) => {
    const newChannel: Channel = {
      ...channelData,
      id: `c${Date.now()}`,
    };
    set((state) => {
      if (!state.editingActivity) return state;
      const newActivity = {
        ...state.editingActivity,
        channels: [...state.editingActivity.channels, newChannel],
        budget: state.editingActivity.budget + channelData.cost,
      };
      return { editingActivity: newActivity };
    });
  },

  updateChannel: (channelId, data) => {
    set((state) => {
      if (!state.editingActivity) return state;
      const newChannels = state.editingActivity.channels.map((c) =>
        c.id === channelId ? { ...c, ...data } : c
      );
      return { editingActivity: { ...state.editingActivity, channels: newChannels } };
    });
  },

  deleteChannel: (channelId) => {
    set((state) => {
      if (!state.editingActivity) return state;
      const deletedChannel = state.editingActivity.channels.find((c) => c.id === channelId);
      const newChannels = state.editingActivity.channels.filter((c) => c.id !== channelId);
      return {
        editingActivity: {
          ...state.editingActivity,
          channels: newChannels,
          budget: state.editingActivity.budget - (deletedChannel?.cost || 0),
        },
      };
    });
  },
}));