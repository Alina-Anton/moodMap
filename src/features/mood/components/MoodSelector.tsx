import { useMemo, useState, type FormEvent } from 'react'
import { tagOptions, moodOptions, encouragements } from '../../../shared/constants/mood'
import { Button } from '../../../shared/components/Button'
import { Card } from '../../../shared/components/Card'
import { Input } from '../../../shared/components/Input'
import { useMood } from '../hooks/useMood'
import type { MoodTag, MoodValue } from '../types'

export function MoodSelector() {
  const { logMood } = useMood()
  const [mood, setMood] = useState<MoodValue>(3)
  const [note, setNote] = useState('')
  const [tags, setTags] = useState<MoodTag[]>([])
  const [message, setMessage] = useState('')

  const canSubmit = useMemo(() => mood >= 1 && mood <= 5, [mood])

  function toggleTag(tag: MoodTag) {
    setTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    )
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit) return
    logMood({ mood, note, tags })
    setNote('')
    setTags([])
    setMessage(encouragements[Math.floor(Math.random() * encouragements.length)] ?? '')
  }

  return (
    <Card title="Log your mood" subtitle="How are you feeling right now?">
      <form className="stack-md" onSubmit={handleSubmit}>
        <div className="mood-grid">
          {moodOptions.map((item) => (
            <button
              type="button"
              key={item.value}
              className={mood === item.value ? 'mood-pill active' : 'mood-pill'}
              onClick={() => setMood(item.value)}
            >
              <span>{item.emoji}</span>
              <small>{item.label}</small>
            </button>
          ))}
        </div>

        <Input
          multiline
          label="Note (optional)"
          placeholder="Anything important about today?"
          value={note}
          rows={3}
          onChange={(event) => setNote(event.target.value)}
        />

        <div className="chip-row">
          {tagOptions.map((tag) => (
            <button
              type="button"
              key={tag}
              className={tags.includes(tag) ? 'chip active' : 'chip'}
              onClick={() => toggleTag(tag)}
            >
              #{tag}
            </button>
          ))}
        </div>

        <Button type="submit">Save entry</Button>
        {message ? <p className="hint">{message}</p> : null}
      </form>
    </Card>
  )
}
