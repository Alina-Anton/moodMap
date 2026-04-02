import type { DetectedPatterns } from './detectPatterns'

export function generateInsights(patterns: DetectedPatterns) {
  const insights: string[] = []

  if (patterns.lowSleepAverage > 0 && patterns.lowSleepAverage <= 2.2) {
    insights.push('You feel worse on low sleep days.')
  }

  if (patterns.exerciseAverage >= 3.5) {
    insights.push('Mood improves after exercise.')
  }

  if (patterns.weekendAverage > patterns.weekdayAverage + 0.4) {
    insights.push('Weekends look more positive than weekdays.')
  }

  if (insights.length === 0) {
    insights.push('No strong patterns yet. Keep logging to unlock better insights.')
  }

  return insights
}
