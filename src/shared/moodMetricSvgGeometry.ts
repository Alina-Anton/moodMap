/** ViewBox 0–100 (x), 0–36 (y). Inner inset so line/grid don’t touch edges. */
export const MOOD_METRIC_VB_W = 100;
export const MOOD_METRIC_VB_H = 36;
const PAD_X = 4;
export const MOOD_METRIC_INNER_LEFT = PAD_X;
export const MOOD_METRIC_INNER_RIGHT = MOOD_METRIC_VB_W - PAD_X;
export const MOOD_METRIC_INNER_TOP = 6;
export const MOOD_METRIC_INNER_BOTTOM = 30;

/** Horizontal padding as % of full width (for label rows aligned with the plot). */
export function moodMetricSidePadPercent() {
  return `${((PAD_X / MOOD_METRIC_VB_W) * 100).toFixed(4)}%`;
}

export function moodToMetricSvgY(mood: number) {
  return (
    MOOD_METRIC_INNER_TOP +
    ((5 - mood) / 4) * (MOOD_METRIC_INNER_BOTTOM - MOOD_METRIC_INNER_TOP)
  );
}

/** X at column centers inside padded band (index i of n slots). */
export function moodMetricCheckInX(i: number, n: number) {
  return (
    MOOD_METRIC_INNER_LEFT +
    ((i + 0.5) / n) * (MOOD_METRIC_INNER_RIGHT - MOOD_METRIC_INNER_LEFT)
  );
}

export function moodMetricDotLeftPercent(i: number, n: number) {
  return ((moodMetricCheckInX(i, n) / MOOD_METRIC_VB_W) * 100).toFixed(4);
}

export function moodMetricDotTopPercent(mood: number) {
  return `${((moodToMetricSvgY(mood) / MOOD_METRIC_VB_H) * 100).toFixed(4)}`;
}

export type MoodMetricGridLineH = { y: number; key: string };
export type MoodMetricGridLineV = { x: number; key: string };

/** Contiguous non-null runs → polyline `points` strings (same coordinate space as timeline). */
export function moodMetricPolylineSegments(values: (number | null)[]) {
  const n = values.length;
  const segments: string[] = [];
  let current: string[] = [];
  for (let i = 0; i < n; i++) {
    const v = values[i];
    if (v == null) {
      if (current.length) {
        segments.push(current.join(" "));
        current = [];
      }
    } else {
      const x = moodMetricCheckInX(i, n);
      const y = moodToMetricSvgY(v);
      current.push(`${x},${y}`);
    }
  }
  if (current.length) segments.push(current.join(" "));
  return segments;
}

export function moodMetricPointGrid(values: (number | null)[]) {
  const n = values.length;
  const uniqueY = [
    ...new Set(
      values.filter((v): v is number => v != null).map((v) => moodToMetricSvgY(v)),
    ),
  ];
  const horizontals: MoodMetricGridLineH[] = uniqueY.map((y) => ({
    y,
    key: `h-${y}`,
  }));
  const verticals: MoodMetricGridLineV[] = [];
  for (let i = 0; i < n; i++) {
    if (values[i] != null) {
      verticals.push({
        x: moodMetricCheckInX(i, n),
        key: `v-${i}`,
      });
    }
  }
  return { horizontals, verticals };
}
