# MoodMap

**MoodMap** is a modern mood tracking application that helps users understand how their habits, behaviors, and daily activities impact their emotional well-being.

Unlike traditional mood trackers, MoodMap focuses on **pattern detection, actionable insights, and behavioral recommendations**—turning raw data into meaningful self-awareness.

---

## Features

### Hourly Mood Tracking

- Log mood throughout the day (not just once)
- Add notes and contextual tags (work, sleep, exercise, social)
- Visual timeline of mood fluctuations

### Smart Insights

- Detect patterns between mood and habits
- Example:
  - _“You feel worse on days with < 6h sleep”_
  - _“Your mood improves after exercise”_

### Recommendations Engine

- Suggest actions based on behavior:
  - _“You’ve had 3 low-mood days → try a short walk”_
  - _“You feel better after social activity → reach out to a friend”_

### Positive Reinforcement

- Encouraging feedback based on trends:
  - _“You handled a tough week well”_
  - _“You improved compared to last week”_

### Analytics Dashboard

- Weekly/monthly mood trends
- Correlation between mood and tagged activities
- Visual insights to support decision-making

---

## Tech Stack

- **React + TypeScript**
- **Zustand** (state management)
- **SVG** (shared mood line metric for timeline + analytics)
- **LocalStorage** (data persistence for MVP)

---

## Project Structure

```bash
src/
├── app/
│   ├── App.tsx
│   └── providers.tsx
├── features/
│   ├── mood/
│   │   ├── components/
│   │   │   ├── MoodSelector.tsx
│   │   │   └── MoodTimeline.tsx
│   │   ├── hooks/
│   │   │   └── useMood.ts
│   │   ├── store/
│   │   │   └── moodStore.ts
│   │   └── types.ts
│   ├── insights/
│   │   ├── components/
│   │   │   └── InsightsList.tsx
│   │   ├── hooks/
│   │   │   └── useInsights.ts
│   │   └── utils/
│   │       ├── detectPatterns.ts
│   │       └── generateInsights.ts
│   └── analytics/
│       └── components/
│           └── MoodChart.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── AnalyticsPage.tsx
│   ├── HistoryPage.tsx
│   └── InsightsPage.tsx
├── shared/
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   ├── constants/
│   │   └── mood.ts
│   └── utils/
│       └── date.ts
├── lib/
│   └── storage.ts
├── styles/
│   └── globals.css
├── types/
│   └── index.ts
└── main.tsx

```
