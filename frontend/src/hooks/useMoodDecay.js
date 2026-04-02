import { decreaseCatStat } from "@/services/catApi.js";

export function useMoodDecay(selectedCatId, onCatUpdated) {
  return async () => {
    if (!selectedCatId) return;

    try {
      onCatUpdated?.((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          mood: Math.max(0, prev.stats.mood - 1)
        }
      }));

      await decreaseCatStat(selectedCatId, "mood");
    } catch (e) {
      console.error("Failed to decrease mood", e);
    }
  };
}
