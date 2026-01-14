import { apiFetch } from "./apiClient";

export async function getAllItems() {
  const res = await apiFetch("/api/items");
  if (!res.ok) throw new Error("FAILED_TO_LOAD_ITEMS");
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function increaseItemAmountByName(name) {
  const res = await apiFetch(
    `/api/items/${encodeURIComponent(name)}/increment`,
    {
      method: "POST"
    }
  );

  if (!res.ok) {
    throw new Error("Failed to increase item amount");
  }

  return res.json();
}
