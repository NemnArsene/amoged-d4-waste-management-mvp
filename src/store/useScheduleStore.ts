// ============================================
// AMOGED-D4 - Schedule Store (Zustand)
// Centralized store for collection schedules
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CollectionSchedule, CollectionZone } from '../types';
import { MOCK_SCHEDULES } from '../data/mockData';

interface ScheduleStore {
  schedules: CollectionSchedule[];

  updateSchedule: (id: string, data: Partial<CollectionSchedule>) => void;
  addSchedule: (data: Omit<CollectionSchedule, 'id'>) => void;
}

export const useScheduleStore = create<ScheduleStore>()(
  persist(
    (set) => ({
      schedules: MOCK_SCHEDULES,

      updateSchedule: (id, data) => {
        set(state => ({
          schedules: state.schedules.map(s =>
            s.id === id ? { ...s, ...data } : s
          ),
        }));
      },

      addSchedule: (data) => {
        const newSchedule: CollectionSchedule = {
          ...data,
          id: `sch-${Date.now()}`,
        };
        set(state => ({
          schedules: [...state.schedules, newSchedule],
        }));
      },
    }),
    {
      name: 'amoged-schedules',
    }
  )
);
