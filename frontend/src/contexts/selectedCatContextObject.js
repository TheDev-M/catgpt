import { createContext } from "react";

// Kept apart from the provider component so the provider module exports only
// components, which is what React Fast Refresh needs to hot-reload it.
export const SelectedCatContext = createContext(null);
