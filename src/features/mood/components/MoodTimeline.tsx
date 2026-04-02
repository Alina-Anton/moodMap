import { Card } from '../../../shared/components/Card'
import { moodOptions } from '../../../shared/constants/mood'
import { useMood } from '../hooks/useMood'

function hourLabel(dateString: string) {
  return new Date(dateString).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function MoodTimeline() {
  const { entries } = useMood()

  if (entries.length === 0) {
    return (
      <Card title="Timeline">
        <p className="empty-state">No entries yet. Add your first mood check-in.</p>
      </Card>
    )
  }

  return (
    <Card title="Today timeline" subtitle="A quick view of your check-ins">
      <div className="timeline">
        {entries.map((entry) => {
          const moodMeta = moodOptions.find((item) => item.value === entry.mood)
          return (
            <article key={entry.id} className="timeline-item">
              <time>{hourLabel(entry.createdAt)}</time>
              <div className="timeline-mood">{moodMeta?.emoji ?? '🙂'}</div>
              <small>{moodMeta?.label ?? 'Mood'}</small>
            </article>
          )
        })}
      </div>
    </Card>
  )
}
