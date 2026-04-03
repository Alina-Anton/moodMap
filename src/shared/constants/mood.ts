import type { MoodTag, MoodValue } from '../../features/mood/types'

export const moodOptions: { value: MoodValue; emoji: string; label: string }[] = [
  { value: 1, emoji: '😞', label: 'Very low' },
  { value: 2, emoji: '😕', label: 'Low' },
  { value: 3, emoji: '😐', label: 'Neutral' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😁', label: 'Great' },
]

/** High → low, for SVG mood metric Y-axis (timeline + analytics). */
export const moodMetricAxisLevels: { mood: MoodValue; label: string }[] = [...moodOptions]
  .sort((a, b) => b.value - a.value)
  .map(({ value, label }) => ({ mood: value, label }))

export const tagOptions: MoodTag[] = ['work', 'sleep', 'exercise', 'social']

export const encouragements = [
  'Nice check-in. Small steps add up.',
  'You showed up for yourself today.',
  'Awareness is progress. Keep going.',
  'Consistency beats intensity. Great job.',
]
