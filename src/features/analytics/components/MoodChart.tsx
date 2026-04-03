import { useMemo, useState } from "react";
import { Card } from "../../../shared/components/Card";
import { SvgMoodLineMetric } from "../../../shared/components/SvgMoodLineMetric";
import { moodMetricAxisLevels } from "../../../shared/constants/mood";
import {
  MOOD_METRIC_VB_H,
  moodMetricDotLeftPercent,
  moodMetricDotTopPercent,
  moodMetricPointGrid,
  moodMetricPolylineSegments,
  moodMetricSidePadPercent,
  moodToMetricSvgY,
} from "../../../shared/moodMetricSvgGeometry";
import { useMood } from "../../mood/hooks/useMood";
import type { MoodEntry } from "../../mood/types";

export type TrendPeriod = "hourly" | "daily" | "weekly" | "monthly";

interface ChartPoint {
  label: string;
  value: number | null;
}

const PERIODS: { id: TrendPeriod; label: string }[] = [
  { id: "hourly", label: "Hourly" },
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
];

function getCalendarDayKey(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function calendarDayKeyFromDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Monday 00:00 local for the week containing `d`. */
function startOfMondayWeek(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const day = x.getDay();
  const off = day === 0 ? -6 : 1 - day;
  x.setDate(x.getDate() + off);
  return x;
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function getWeekStartKey(iso: string) {
  return calendarDayKeyFromDate(startOfMondayWeek(new Date(iso)));
}

function pickDailyReferenceDayKey(entries: MoodEntry[]): string {
  const today = calendarDayKeyFromDate(new Date());
  if (entries.some((e) => getCalendarDayKey(e.createdAt) === today)) {
    return today;
  }
  return entries.reduce((best, e) => {
    const k = getCalendarDayKey(e.createdAt);
    return k > best ? k : best;
  }, getCalendarDayKey(entries[0]!.createdAt));
}

/** e.g. 9AM, 2PM — compact 12h, no space before AM/PM. */
function formatHourAmPm(hour0to23: number) {
  const d = new Date(2000, 0, 1, hour0to23, 0, 0, 0);
  const s = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true,
  });
  return s.replace(/\s*([AP]M)/i, (_, ap: string) => ap.toUpperCase());
}

function entryMonthKey(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function startOfCalendarMonth(d: Date): Date {
  const x = new Date(d);
  x.setDate(1);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addCalendarMonths(d: Date, delta: number): Date {
  const x = new Date(d);
  x.setMonth(x.getMonth() + delta);
  return x;
}

/** Reference day: one point per clock hour that has logs; average mood within the hour. */
function buildHourlyForReferenceDay(entries: MoodEntry[]): ChartPoint[] {
  const dayKey = pickDailyReferenceDayKey(entries);
  const dayEntries = entries
    .filter((e) => getCalendarDayKey(e.createdAt) === dayKey)
    .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));

  const byHour = new Map<number, MoodEntry[]>();
  for (const e of dayEntries) {
    const h = new Date(e.createdAt).getHours();
    const list = byHour.get(h);
    if (list) list.push(e);
    else byHour.set(h, [e]);
  }

  const sortedHours = [...byHour.keys()].sort((a, b) => a - b);
  return sortedHours.map((h) => {
    const list = byHour.get(h)!;
    const sum = list.reduce((acc, e) => acc + e.mood, 0);
    return {
      label: formatHourAmPm(h),
      value: Number((sum / list.length).toFixed(2)),
    };
  });
}

/** Mon–Sun of the current week (local); null days with no entries. */
function buildDailySevenDayWeek(entries: MoodEntry[]): ChartPoint[] {
  const monday = startOfMondayWeek(new Date());
  return Array.from({ length: 7 }, (_, i) => {
    const d = addDays(monday, i);
    const key = calendarDayKeyFromDate(d);
    const dayEntries = entries.filter(
      (e) => getCalendarDayKey(e.createdAt) === key,
    );
    const label = d.toLocaleDateString([], {
      weekday: "short",
      day: "numeric",
    });
    if (dayEntries.length === 0) {
      return { label, value: null };
    }
    const sum = dayEntries.reduce((acc, e) => acc + e.mood, 0);
    return { label, value: Number((sum / dayEntries.length).toFixed(2)) };
  });
}

function formatWeekShortLabel(weekStartKey: string) {
  const [y, m, d] = weekStartKey.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

/** Four Monday-start weeks ending with the current week; null if no data that week. */
function buildWeeklyFourWeeks(entries: MoodEntry[]): ChartPoint[] {
  const thisMonday = startOfMondayWeek(new Date());
  const keys: string[] = [];
  for (let i = 3; i >= 0; i--) {
    keys.push(calendarDayKeyFromDate(addDays(thisMonday, -7 * i)));
  }
  return keys.map((weekKey) => {
    const inWeek = entries.filter(
      (e) => getWeekStartKey(e.createdAt) === weekKey,
    );
    return {
      label: `${formatWeekShortLabel(weekKey)}`,
      value:
        inWeek.length === 0
          ? null
          : Number(
              (
                inWeek.reduce((acc, e) => acc + e.mood, 0) / inWeek.length
              ).toFixed(2),
            ),
    };
  });
}

/** Last 12 calendar months ending with the current month; null if no entries that month. */
function buildMonthlyTwelveMonths(entries: MoodEntry[]): ChartPoint[] {
  const anchor = startOfCalendarMonth(new Date());
  return Array.from({ length: 12 }, (_, i) => {
    const m = addCalendarMonths(anchor, -(11 - i));
    const key = `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, "0")}`;
    const inMonth = entries.filter((e) => entryMonthKey(e.createdAt) === key);
    const label = m.toLocaleDateString([], {
      month: "short",
      year: "numeric",
    });
    if (inMonth.length === 0) {
      return { label, value: null };
    }
    const sum = inMonth.reduce((acc, e) => acc + e.mood, 0);
    return {
      label,
      value: Number((sum / inMonth.length).toFixed(2)),
    };
  });
}

function aggregateByPeriod(
  entries: MoodEntry[],
  period: TrendPeriod,
): ChartPoint[] {
  switch (period) {
    case "hourly":
      return buildHourlyForReferenceDay(entries);
    case "daily":
      return buildDailySevenDayWeek(entries);
    case "weekly":
      return buildWeeklyFourWeeks(entries);
    case "monthly":
      return buildMonthlyTwelveMonths(entries);
    default:
      return [];
  }
}

function averageDefined(values: (number | null)[]) {
  const nums = values.filter((v): v is number => v != null);
  if (nums.length === 0) return 0;
  return Number((nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2));
}

export function MoodChart() {
  const { entries, averageMood } = useMood();
  const [period, setPeriod] = useState<TrendPeriod>("daily");

  const data = useMemo(
    () => aggregateByPeriod(entries, period),
    [entries, period],
  );

  const viewAverage = useMemo(
    () => averageDefined(data.map((p) => p.value)),
    [data],
  );

  const values = useMemo(() => data.map((p) => p.value), [data]);

  const polylines = useMemo(() => moodMetricPolylineSegments(values), [values]);

  const { horizontals, verticals } = useMemo(
    () => moodMetricPointGrid(values),
    [values],
  );

  const metricSummary = useMemo(() => {
    const n = data.length;
    const defined = values.filter((v) => v != null).length;
    return `Mood trend, ${PERIODS.find((p) => p.id === period)?.label ?? period} view: ${defined} point${defined === 1 ? "" : "s"} across ${n} slot${n === 1 ? "" : "s"}. Scale 1–5.`;
  }, [data.length, period, values]);

  const xLabelsStyle = useMemo(
    () => ({
      gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))`,
      paddingLeft: moodMetricSidePadPercent(),
      paddingRight: moodMetricSidePadPercent(),
    }),
    [data.length],
  );

  if (entries.length === 0) {
    return (
      <Card title="Mood trend">
        <p className="empty-state">
          Your chart will appear after your first mood entry.
        </p>
      </Card>
    );
  }

  return (
    <Card
      title="Mood trend"
      subtitle={`This view: ${viewAverage} / 5 · All-time avg: ${averageMood.toFixed(2)} / 5`}
    >
      <div
        className="analytics-tabs"
        role="tablist"
        aria-label="Trend granularity"
      >
        {PERIODS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={period === p.id}
            aria-controls="analytics-trend-panel"
            id={`analytics-tab-${p.id}`}
            className={
              period === p.id ? "analytics-tab active" : "analytics-tab"
            }
            onClick={() => setPeriod(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div
        id="analytics-trend-panel"
        role="tabpanel"
        aria-labelledby={`analytics-tab-${period}`}
        className="analytics-tabpanel"
      >
        <div
          className={
            period === "weekly"
              ? "analytics-metric-grid-wrap analytics-metric-grid-wrap--weekly"
              : "analytics-metric-grid-wrap"
          }
        >
          <div className="analytics-metric-axis" aria-hidden>
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
          <div className="analytics-chart-stack">
            <SvgMoodLineMetric
              className="analytics-metric-chart-surface"
              plotWrapperClassName="analytics-chart-plot-wrap"
              metricSummary={metricSummary}
              polylines={polylines}
              horizontals={horizontals}
              verticals={verticals}
              dots={data.map((p, i) => {
                if (p.value == null) return null;
                return (
                  <div
                    key={`${period}-${i}-${p.label}`}
                    className="timeline-dot-with-tooltip"
                    style={{
                      left: `${moodMetricDotLeftPercent(i, data.length)}%`,
                      top: `${moodMetricDotTopPercent(p.value)}%`,
                    }}
                    tabIndex={0}
                    role="group"
                    aria-label={`${p.label}, mood ${p.value} out of 5`}
                  >
                    <div className="timeline-metric-dot-hit">
                      <span
                        className="timeline-metric-dot-visual"
                        aria-hidden
                      />
                    </div>
                    <div role="tooltip" className="timeline-dot-tooltip">
                      <strong>{p.label}</strong>
                      <div>{p.value} / 5</div>
                    </div>
                  </div>
                );
              })}
            />
          </div>
          <div className="analytics-metric-axis-spacer" aria-hidden />
          <div className="analytics-metric-x-labels" style={xLabelsStyle}>
            {data.map((p, i) => (
              <div key={i} className="analytics-metric-x-cell">
                <span className="analytics-metric-x-cell-text">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
