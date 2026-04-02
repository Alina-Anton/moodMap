import { MoodSelector } from '../features/mood/components/MoodSelector'
import { MoodTimeline } from '../features/mood/components/MoodTimeline'

export function HomePage() {
  return (
    <div className="page-stack">
      <MoodSelector />
      <MoodTimeline />
    </div>
  )
}
