import type { MoodTag, MoodValue } from '../../features/mood/types'

export const moodOptions: { value: MoodValue; emoji: string; label: string }[] = [
  { value: 1, emoji: '😞', label: 'Very low' },
  { value: 2, emoji: '😕', label: 'Low' },
  { value: 3, emoji: '😐', label: 'Neutral' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😁', label: 'Great' },
]

export const tagOptions: MoodTag[] = ['work', 'sleep', 'exercise', 'social']

export const encouragements = [
  'Nice check-in. Small steps add up.',
  'You showed up for yourself today.',
  'Awareness is progress. Keep going.',
  'Consistency beats intensity. Great job.',
]
