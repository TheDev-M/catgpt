import { useEffect } from "react";
import { decreaseCatStat } from "@/services/catApi.js";
import { GAME_CONFIG } from "@/config/gameConfig.js";

export function useHungerDecay(selectedCatId, onCatUpdated) {
  useEffect(() => {
    if (!selectedCatId) return;

    const interval = setInterval(async () => {
      try {
        onCatUpdated?.((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            stats: {
              ...prev.stats,
              hunger: Math.max(0, prev.stats.hunger - 1)
            }
          };
        });

        await decreaseCatStat(selectedCatId, "hunger");
      } catch (e) {
        console.error("Failed to decrease hunger", e);
      }
    }, GAME_CONFIG.decay.hungerInterval);

    return () => clearInterval(interval);
  }, [selectedCatId, onCatUpdated]);
}
