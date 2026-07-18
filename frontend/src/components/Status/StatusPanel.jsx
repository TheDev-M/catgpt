import { useTranslation } from "react-i18next";
import HungerBar from "./HungerBar.jsx";
import MoodBar from "./MoodBar.jsx";
import HealthBar from "./HealthBar.jsx";

export default function StatusPanel({ cat, loading, error }) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="card bg-base-200/80 shadow rounded-2xl p-2 sm:p-3 w-44 sm:w-56">
        <div className="skeleton hidden sm:block h-4 w-2/3 mb-2" />
        <div className="skeleton h-1.5 sm:h-2 w-full mb-1.5 sm:mb-2" />
        <div className="skeleton h-1.5 sm:h-2 w-full mb-1.5 sm:mb-2" />
        <div className="skeleton h-1.5 sm:h-2 w-full" />
      </div>
    );
  }

  if (error || !cat) {
    return (
      <div className="card bg-base-200/80 shadow rounded-2xl p-2 sm:p-3 w-44 sm:w-56 text-xs">
        <p className="opacity-70">{t("status.loadError")}</p>
      </div>
    );
  }

  const hunger = cat.stats?.hunger ?? 0;
  const mood = cat.stats?.mood ?? 0;
  const health = cat.stats?.health ?? 0;

  return (
    <div className="card bg-base-200/80 shadow rounded-2xl p-2 sm:p-3 w-44 sm:w-56 text-xs">
      <p className="hidden sm:block font-semibold mb-2 truncate">{cat.name || t("status.currentCat")}</p>
      <div className="space-y-0.5 sm:space-y-2">
        <HungerBar value={hunger} />
        <MoodBar value={mood} />
        <HealthBar value={health} />
      </div>
    </div>
  );
}
