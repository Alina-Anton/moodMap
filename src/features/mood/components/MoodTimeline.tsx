import { useMemo } from "react";
import { Card } from "../../../shared/components/Card";
import { SvgMoodLineMetric } from "../../../shared/components/SvgMoodLineMetric";
import { moodMetricAxisLevels } from "../../../shared/constants/mood";
import {
  MOOD_METRIC_VB_H,
  moodMetricCheckInX,
  moodMetricDotLeftPercent,
  moodMetricDotTopPercent,
  moodMetricPointGrid,
  moodMetricPolylineSegments,
  moodMetricSidePadPercent,
  moodToMetricSvgY,
} from "../../../shared/moodMetricSvgGeometry";
import { useMood } from "../hooks/useMood";

/** e.g. 10:25AM, 11:15PM (no space before AM/PM). */
function hourLabelAmPmCompact(dateString: string) {
  const s = new Date(dateString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return s.replace(/\s*([AP]M)/i, (_, ap: string) => ap.toUpperCase());
}

export function MoodTimeline() {
  const { entries } = useMood();

  const sortedChronological = useMemo(
    () =>
      [...entries].sort(
        (a, b) => +new Date(a.createdAt) - +new Date(b.createdAt),
      ),
    [entries],
  );

  const n = sortedChronological.length;
  const polylines = useMemo(
    () => moodMetricPolylineSegments(sortedChronological.map((e) => e.mood)),
    [sortedChronological],
  );

  const timesGridStyle = useMemo(
    () => ({
      gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
      paddingLeft: moodMetricSidePadPercent(),
      paddingRight: moodMetricSidePadPercent(),
    }),
    [n],
  );

  const pointGridLines = useMemo(() => {
    const values = sortedChronological.map((e) => e.mood);
    const { horizontals } = moodMetricPointGrid(values);
    const verticals = sortedChronological.map((entry, i) => ({
      x: moodMetricCheckInX(i, n),
      key: entry.id,
    }));
    return { horizontals, verticals };
  }, [sortedChronological, n]);

  if (entries.length === 0) {
    return (
      <Card title="Timeline">
        <p className="empty-state">
          No entries yet. Add your first mood check-in.
        </p>
      </Card>
    );
  }

  const metricSummary = `Mood trend across ${sortedChronological.length} check-in${
    sortedChronological.length === 1 ? "" : "s"
  }, from earlier to later today. Scale: Great, Good, Neutral, Low, Very low.`;

  return (
    <Card title="Today timeline" subtitle="A quick view of your check-ins">
      <div className="timeline-metric-grid-wrap">
        <div className="timeline-metric-axis" aria-hidden>
          {moodMetricAxisLevels.map(({ mood, label }) => (
            <span
              key={mood}
              className="timeline-metric-axis-label"
              style={{
                top: `${(moodToMetricSvgY(mood) / MOOD_METRIC_VB_H) * 100}%`,
              }}
            >
              {label}
            </span>
          ))}
        </div>
        <SvgMoodLineMetric
          className="timeline-chart-stack"
          metricSummary={metricSummary}
          polylines={polylines}
          horizontals={pointGridLines.horizontals}
          verticals={pointGridLines.verticals}
          dots={sortedChronological.map((entry, i) => {
            const note = entry.note?.trim();
            const tooltipId = `timeline-note-${entry.id}`;
            return (
              <div
                key={entry.id}
                className="timeline-dot-with-tooltip"
                style={{
                  left: `${moodMetricDotLeftPercent(i, n)}%`,
                  top: `${moodMetricDotTopPercent(entry.mood)}%`,
                }}
                tabIndex={0}
                role="group"
                aria-describedby={tooltipId}
                aria-label={`Check-in at ${hourLabelAmPmCompact(entry.createdAt)}${note ? `. Note: ${note}` : ". No note"}`}
              >
                <div className="timeline-metric-dot-hit">
                  <span className="timeline-metric-dot-visual" aria-hidden />
                </div>
                <div
                  id={tooltipId}
                  role="tooltip"
                  className={
                    note
                      ? "timeline-dot-tooltip"
                      : "timeline-dot-tooltip timeline-dot-tooltip--empty"
                  }
                >
                  {note || "No note for this check-in."}
                </div>
              </div>
            );
          })}
        />
        <div className="timeline-metric-axis-spacer" aria-hidden />
        <div className="timeline-times" style={timesGridStyle}>
          {sortedChronological.map((entry) => (
            <div key={entry.id} className="timeline-time-cell">
              <time dateTime={entry.createdAt}>
                {hourLabelAmPmCompact(entry.createdAt)}
              </time>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
