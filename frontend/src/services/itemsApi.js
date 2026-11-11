import { request } from "./apiClient.js";

export async function getAllItems() {
  const data = await request("/api/items", { errorMessage: "FAILED_TO_LOAD_ITEMS" });
  return Array.isArray(data) ? data : [];
}

export function increaseItemAmountByName(name) {
  return request(`/api/items/${encodeURIComponent(name)}/increment`, {
    method: "POST",
    errorMessage: "Failed to increase item amount."
  });
}
