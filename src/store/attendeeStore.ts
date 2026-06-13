import { create } from 'zustand';
import type { Attendee, AttendeeFilters } from '@/types';
import { attendees } from '@/data/attendees';

interface AttendeeState {
  attendees: Attendee[];
  filteredAttendees: Attendee[];
  filters: AttendeeFilters;
  setFilters: (filters: AttendeeFilters) => void;
  clearFilters: () => void;
}

const defaultFilters: AttendeeFilters = {};

function applyFilters(attendees: Attendee[], filters: AttendeeFilters): Attendee[] {
  return attendees.filter((a) => {
    if (filters.search && !a.name.includes(filters.search) && !a.company.includes(filters.search)) {
      return false;
    }
    if (filters.cities && filters.cities.length > 0 && !filters.cities.includes(a.city)) {
      return false;
    }
    if (filters.industries && filters.industries.length > 0 && !filters.industries.includes(a.industry)) {
      return false;
    }
    if (filters.customerLevels && filters.customerLevels.length > 0 && !filters.customerLevels.includes(a.customerLevel)) {
      return false;
    }
    if (filters.statuses && filters.statuses.length > 0 && !filters.statuses.includes(a.status)) {
      return false;
    }
    if (filters.channels && filters.channels.length > 0 && !filters.channels.includes(a.channel)) {
      return false;
    }
    return true;
  });
}

export const useAttendeeStore = create<AttendeeState>((set) => ({
  attendees: attendees,
  filteredAttendees: attendees,
  filters: defaultFilters,
  setFilters: (filters: AttendeeFilters) => set((state) => ({
    filters: { ...state.filters, ...filters },
    filteredAttendees: applyFilters(state.attendees, { ...state.filters, ...filters }),
  })),
  clearFilters: () => set({
    filters: defaultFilters,
    filteredAttendees: attendees,
  }),
}));