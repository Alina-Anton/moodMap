import { useMemo } from 'react'
import { useMood } from '../../mood/hooks/useMood'
import { detectPatterns } from '../utils/detectPatterns'
import { generateInsights } from '../utils/generateInsights'

export function useInsights() {
  const { entries } = useMood()

  const patterns = useMemo(() => detectPatterns(entries), [entries])
  const insights = useMemo(() => generateInsights(patterns), [patterns])

  return {
    insights,
    patterns,
    hasData: entries.length > 0,
  }
}
