import { apiFetch } from "./apiClient";

export async function getCatById(id) {
  const res = await apiFetch(`/api/cats/${id}`);

  if (!res.ok) {
    const err = new Error("FAILED_TO_LOAD_CAT");
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export async function createCat({
  name,
  breed,
  temperaments,
  sourceMetrics,
  image
}) {
  const res = await apiFetch("/api/cats", {
    method: "POST",
    body: JSON.stringify({ name, breed, temperaments, sourceMetrics, image })
  });

    if (!res.ok) {
        let serverMsg = "Request failed.";
        const data = await res.json();
        serverMsg = data.message || data.error || serverMsg;
        throw new Error(serverMsg);
    }

  return res.json();
}

export async function getAllCats() {
  const res = await apiFetch("/api/cats");
  if (!res.ok) throw new Error("FAILED_TO_LOAD_CATS");
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export function getBreedsFromCats(cats = []) {
  return Array.from(new Set(cats.map((c) => c.breed).filter(Boolean))).sort();
}

export async function renameCatById(id, newName) {
  const res = await apiFetch(`/api/cats/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ name: newName })
  });

    if (!res.ok) {
        let serverMsg = "Request failed.";
        const data = await res.json();
        serverMsg = data.message || data.error || serverMsg;
        throw new Error(serverMsg);
    }

    return res.json();
}

export async function deleteCatById(id) {
  const res = await apiFetch(`/api/cats/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete cat");
}

export async function applyItem(catId, itemId) {
  const res = await apiFetch(`/api/cats/${catId}/items/${itemId}`, {
    method: "POST"
  });

  if (!res.ok) throw new Error("APPLY_ITEM_FAILED");
  return res.json();
}

export async function decreaseCatStat(catId, stat) {
  const res = await apiFetch(`/api/cats/${catId}/stats/${stat}/decrement`, {
    method: "POST"
  });

  if (!res.ok) {
    throw new Error(`Failed to decrease ${stat}`);
  }

  const data = await res.json();
  return data.cat;
}
