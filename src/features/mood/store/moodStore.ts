import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { storage } from '../../../lib/storage'
import type { MoodEntry, MoodTag, MoodValue } from '../types'

interface MoodState {
  entries: MoodEntry[]
  addEntry: (payload: { mood: MoodValue; note?: string; tags: MoodTag[] }) => void
}

function createMoodEntryId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export const useMoodStore = create<MoodState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: ({ mood, note, tags }) =>
        set((state) => ({
          entries: [
            {
              id: createMoodEntryId(),
              mood,
              note: note?.trim() || undefined,
              tags,
              createdAt: new Date().toISOString(),
            },
            ...state.entries,
          ],
        })),
    }),
    {
      name: 'moodmap-entries',
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({ entries: state.entries }),
    },
  ),
)
