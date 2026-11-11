import { useContext } from "react";
import { SelectedCatContext } from "@/contexts/selectedCatContextObject.js";

export function useSelectedCat() {
  const ctx = useContext(SelectedCatContext);
  if (!ctx) {
    throw new Error("useSelectedCat must be used within <SelectedCatProvider>");
  }
  return ctx;
}
