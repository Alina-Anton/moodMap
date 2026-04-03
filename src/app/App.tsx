import { NavLink, Route, Routes } from "react-router-dom";
import { AnalyticsPage } from "../pages/AnalyticsPage";
import { HistoryPage } from "../pages/HistoryPage";
import { HomePage } from "../pages/HomePage";
import { InsightsPage } from "../pages/InsightsPage";

const links = [
  { to: "/", label: "Today" },
  { to: "/history", label: "Timeline" },
  { to: "/analytics", label: "Analytics" },
  { to: "/insights", label: "Insights" },
];

export function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>MoodMap</h1>
        <p>Track small signals. See bigger patterns.</p>
      </header>

      <nav className="app-nav" aria-label="Main">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            end={link.to === "/"}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <main className="app-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/insights" element={<InsightsPage />} />
        </Routes>
      </main>
    </div>
  );
}
