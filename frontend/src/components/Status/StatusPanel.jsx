import HungerBar from "./HungerBar.jsx";
import MoodBar from "./MoodBar.jsx";
import HealthBar from "./HealthBar.jsx";

export default function StatusPanel({ cat, loading, error }) {
  if (loading) {
    return (
      <div className="card bg-base-200/80 shadow rounded-2xl p-3 w-56">
        <div className="skeleton h-4 w-2/3 mb-2" />
        <div className="skeleton h-2 w-full mb-2" />
        <div className="skeleton h-2 w-full mb-2" />
        <div className="skeleton h-2 w-full" />
      </div>
    );
  }

  if (error || !cat) {
    return (
      <div className="card bg-base-200/80 shadow rounded-2xl p-3 w-56 text-xs">
        <p className="opacity-70">Failed to load status.</p>
      </div>
    );
  }

  const hunger = cat.stats?.hunger ?? 0;
  const mood = cat.stats?.mood ?? 0;
  const health = cat.stats?.health ?? 0;

  return (
    <div className="card bg-base-200/80 shadow rounded-2xl p-3 w-56 text-xs">
      <p className="font-semibold mb-2 truncate">{cat.name || "Current cat"}</p>

      <div className="space-y-2">
        <HungerBar value={hunger} />
        <MoodBar value={mood} />
        <HealthBar value={health} />
      </div>
    </div>
  );
}
