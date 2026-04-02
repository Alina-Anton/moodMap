export type MoodValue = 1 | 2 | 3 | 4 | 5

export type MoodTag = 'work' | 'sleep' | 'exercise' | 'social'

export interface MoodEntry {
  id: string
  mood: MoodValue
  note?: string
  tags: MoodTag[]
  createdAt: string
}

export interface MoodDraft {
  mood: MoodValue
  note: string
  tags: MoodTag[]
}
