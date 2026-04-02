import { useMemo } from 'react'
import { useMoodStore } from '../store/moodStore'
import type { MoodTag, MoodValue } from '../types'

export function useMood() {
  const entries = useMoodStore((state) => state.entries)
  const addEntry = useMoodStore((state) => state.addEntry)

  const averageMood = useMemo(() => {
    if (entries.length === 0) return 0
    const total = entries.reduce((sum, entry) => sum + entry.mood, 0)
    return Number((total / entries.length).toFixed(2))
  }, [entries])

  const latestEntry = entries[0]

  function logMood(payload: { mood: MoodValue; note?: string; tags: MoodTag[] }) {
    addEntry(payload)
  }

  return {
    entries,
    averageMood,
    latestEntry,
    logMood,
  }
}
