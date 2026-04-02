import type { MoodEntry } from '../../mood/types'

export interface DetectedPatterns {
  lowSleepAverage: number
  exerciseAverage: number
  weekdayAverage: number
  weekendAverage: number
}

function average(values: number[]) {
  if (values.length === 0) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

export function detectPatterns(entries: MoodEntry[]): DetectedPatterns {
  const lowSleep = entries.filter((entry) => entry.tags.includes('sleep') && entry.mood <= 2)
  const withExercise = entries.filter((entry) => entry.tags.includes('exercise'))
  const weekday = entries.filter((entry) => {
    const day = new Date(entry.createdAt).getDay()
    return day > 0 && day < 6
  })
  const weekend = entries.filter((entry) => {
    const day = new Date(entry.createdAt).getDay()
    return day === 0 || day === 6
  })

  return {
    lowSleepAverage: average(lowSleep.map((entry) => entry.mood)),
    exerciseAverage: average(withExercise.map((entry) => entry.mood)),
    weekdayAverage: average(weekday.map((entry) => entry.mood)),
    weekendAverage: average(weekend.map((entry) => entry.mood)),
  }
}
