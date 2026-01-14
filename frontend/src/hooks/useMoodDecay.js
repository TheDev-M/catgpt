import { useCallback } from "react";
import { decreaseCatStat } from "@/services/catApi.js";

export function useMoodDecay(selectedCatId, { onCatUpdated } = {}) {
  return useCallback(async () => {
    if (!selectedCatId) return;

    try {
      await decreaseCatStat(selectedCatId, "mood");
      onCatUpdated?.({ background: true });
    } catch (e) {
      console.error("Failed to decrease mood", e);
    }
  }, [selectedCatId, onCatUpdated]);
}
