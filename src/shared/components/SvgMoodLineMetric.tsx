import type { ReactNode } from "react";
import {
  MOOD_METRIC_INNER_BOTTOM,
  MOOD_METRIC_INNER_LEFT,
  MOOD_METRIC_INNER_RIGHT,
  MOOD_METRIC_INNER_TOP,
  MOOD_METRIC_VB_H,
  MOOD_METRIC_VB_W,
  type MoodMetricGridLineH,
  type MoodMetricGridLineV,
} from "../moodMetricSvgGeometry";

type SvgMoodLineMetricProps = {
  /** Appended to `metric-chart-surface` (layout + height). */
  className?: string;
  /** Optional inner wrapper (e.g. analytics plot height). Omit for timeline. */
  plotWrapperClassName?: string;
  metricSummary: string;
  /** Each string is a `points` attribute for one polyline segment. */
  polylines: readonly string[];
  horizontals: readonly MoodMetricGridLineH[];
  verticals: readonly MoodMetricGridLineV[];
  dots: ReactNode;
};

/**
 * SVG mood line + point grid + HTML dot overlay — same structure as Today timeline metric.
 */
export function SvgMoodLineMetric({
  className,
  plotWrapperClassName,
  metricSummary,
  polylines,
  horizontals,
  verticals,
  dots,
}: SvgMoodLineMetricProps) {
  const surfaceClass = ["metric-chart-surface", className].filter(Boolean).join(" ");
  const inner = (
    <>
      <svg
        className="timeline-metric-chart"
        viewBox={`0 0 ${MOOD_METRIC_VB_W} ${MOOD_METRIC_VB_H}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={metricSummary}
      >
        <title>{metricSummary}</title>
        <g className="timeline-metric-grid-layer" aria-hidden>
          {horizontals.map(({ y, key }) => (
            <line
              key={key}
              x1={MOOD_METRIC_INNER_LEFT}
              y1={y}
              x2={MOOD_METRIC_INNER_RIGHT}
              y2={y}
              className="timeline-metric-grid-point"
            />
          ))}
          {verticals.map(({ x, key }) => (
            <line
              key={key}
              x1={x}
              y1={MOOD_METRIC_INNER_TOP}
              x2={x}
              y2={MOOD_METRIC_INNER_BOTTOM}
              className="timeline-metric-grid-point"
            />
          ))}
        </g>
        {polylines.map(
          (points, idx) =>
            points ? (
              <polyline
                key={idx}
                fill="none"
                className="timeline-metric-line"
                points={points}
              />
            ) : null,
        )}
      </svg>
      <div className="timeline-dots-overlay">{dots}</div>
    </>
  );

  return (
    <div className={surfaceClass}>
      {plotWrapperClassName ? (
        <div className={plotWrapperClassName}>{inner}</div>
      ) : (
        inner
      )}
    </div>
  );
}
