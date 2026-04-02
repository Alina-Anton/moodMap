import { useMemo } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card } from '../../../shared/components/Card'
import { useMood } from '../../mood/hooks/useMood'

interface ChartPoint {
  day: string
  value: number
}

function toDayKey(isoDate: string) {
  return new Date(isoDate).toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function MoodChart() {
  const { entries, averageMood } = useMood()

  const data = useMemo<ChartPoint[]>(() => {
    const points = new Map<string, { total: number; count: number }>()
    entries.slice(0, 30).forEach((entry) => {
      const key = toDayKey(entry.createdAt)
      const current = points.get(key) ?? { total: 0, count: 0 }
      points.set(key, { total: current.total + entry.mood, count: current.count + 1 })
    })
    return Array.from(points.entries())
      .map(([day, value]) => ({ day, value: Number((value.total / value.count).toFixed(2)) }))
      .reverse()
      .slice(-7)
  }, [entries])

  if (data.length === 0) {
    return (
      <Card title="Weekly trend">
        <p className="empty-state">Your chart will appear after your first mood entry.</p>
      </Card>
    )
  }

  return (
    <Card title="Weekly mood trend" subtitle={`Average mood: ${averageMood.toFixed(2)} / 5`}>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d7d7df" />
            <XAxis dataKey="day" />
            <YAxis domain={[1, 5]} allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#6d5efc" strokeWidth={3} dot />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
