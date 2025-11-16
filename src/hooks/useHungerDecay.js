import { GAME_CONFIG} from "@/config/gameConfig.js";

import { useEffect } from "react";
import { decreaseCatStat } from "@/services/catApi.js";

export function useHungerDecay(selectedCatId, { onCatUpdated } = {}) {
  useEffect(() => {
    if (!selectedCatId) return;

    const intervalMs = GAME_CONFIG.decay.hungerInterval;

    const id = setInterval(async () => {
      try {
        const updatedCat = await decreaseCatStat(selectedCatId, "hunger");
        onCatUpdated?.(updatedCat);
      } catch (e) {
        console.error("Failed to decrease hunger", e);
      }
    }, intervalMs);

    return () => clearInterval(id);
  }, [selectedCatId, onCatUpdated]);
}
