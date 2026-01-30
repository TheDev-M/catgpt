import { useEffect } from "react";
import { decreaseCatStat } from "@/services/catApi.js";
import { GAME_CONFIG } from "@/config/gameConfig.js";

export function useHungerDecay(selectedCatId, onCatUpdated) {
  useEffect(() => {
    if (!selectedCatId) return;

    const interval = setInterval(async () => {
      try {
        const updatedCat = await decreaseCatStat(selectedCatId, "hunger");
        onCatUpdated?.(updatedCat);
      } catch (e) {
        console.error("Failed to decrease hunger", e);
      }
    }, GAME_CONFIG.decay.hungerInterval);

    return () => clearInterval(interval);
  }, [selectedCatId, onCatUpdated]);
}
