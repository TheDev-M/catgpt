import { useCallback } from "react";
import { decreaseCatStat } from "@/services/catApi.js";

/**
 * Returns a callback that drops the cat's mood by one, optimistically in the UI
 * and then on the server. Unlike hunger this is event-driven (it fires when the
 * cat is talked to), not on a timer.
 */
export function useMoodDecay(selectedCatId, onCatUpdated) {
  return useCallback(async () => {
    if (!selectedCatId) return;

    try {
      onCatUpdated?.((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          stats: { ...prev.stats, mood: Math.max(0, prev.stats.mood - 1) }
        };
      });

      await decreaseCatStat(selectedCatId, "mood");
    } catch (e) {
      console.error("Failed to decrease mood", e);
    }
  }, [selectedCatId, onCatUpdated]);
}
