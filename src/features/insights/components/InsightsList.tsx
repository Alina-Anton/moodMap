import { Card } from '../../../shared/components/Card'
import { useInsights } from '../hooks/useInsights'

export function InsightsList() {
  const { insights, hasData } = useInsights()

  if (!hasData) {
    return (
      <Card title="Insights engine">
        <p className="empty-state">Track moods for a few days to unlock personalized insights.</p>
      </Card>
    )
  }

  return (
    <Card title="Insights engine" subtitle="Patterns generated from recent entries">
      <ul className="insights-list">
        {insights.map((insight) => (
          <li key={insight}>{insight}</li>
        ))}
      </ul>
    </Card>
  )
}
