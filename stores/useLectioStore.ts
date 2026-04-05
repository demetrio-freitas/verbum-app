import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, subDays, differenceInCalendarDays } from 'date-fns';

export interface LectioEntry {
  id: string;
  date: string;
  reference: string;
  duration: number;
  meditatio: string;
  oratio: string;
  completedAt: string;
}

interface LectioState {
  entries: LectioEntry[];
  addEntry: (entry: Omit<LectioEntry, 'id'>) => void;
  getEntriesByDate: (date: string) => LectioEntry[];
  getLectioStreak: () => number;
}

export const useLectioStore = create<LectioState>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (entry) => {
        const id = `${entry.date}-${Date.now()}`;
        set((state) => ({
          entries: [...state.entries, { ...entry, id }],
        }));
      },

      getEntriesByDate: (date) => {
        return get().entries.filter((e) => e.date === date);
      },

      getLectioStreak: () => {
        const { entries } = get();
        if (entries.length === 0) return 0;

        const uniqueDates = [...new Set(entries.map((e) => e.date))].sort().reverse();
        const today = format(new Date(), 'yyyy-MM-dd');
        const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

        if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) return 0;

        let streak = 1;
        for (let i = 1; i < uniqueDates.length; i++) {
          const diff = differenceInCalendarDays(
            new Date(uniqueDates[i - 1]),
            new Date(uniqueDates[i])
          );
          if (diff === 1) streak++;
          else break;
        }
        return streak;
      },
    }),
    {
      name: 'verbum-lectio',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
