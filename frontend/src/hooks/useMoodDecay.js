import { decreaseCatStat } from "@/services/catApi.js";

export function useMoodDecay(selectedCatId, onCatUpdated) {
  return async () => {
    if (!selectedCatId) return;

    try {
      await decreaseCatStat(selectedCatId, "mood");
      onCatUpdated?.();
    } catch (e) {
      console.error("Failed to decrease mood", e);
    }
  };
}
