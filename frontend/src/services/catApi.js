import { request } from "./apiClient.js";

export function getCatById(id) {
  return request(`/api/cats/${id}`, { errorMessage: "FAILED_TO_LOAD_CAT" });
}

export function createCat({ name, breed, temperaments, sourceMetrics, image }) {
  return request("/api/cats", {
    method: "POST",
    json: { name, breed, temperaments, sourceMetrics, image }
  });
}

export async function getAllCats() {
  const data = await request("/api/cats", { errorMessage: "FAILED_TO_LOAD_CATS" });
  return Array.isArray(data) ? data : [];
}

export function getBreedsFromCats(cats = []) {
  return Array.from(new Set(cats.map((c) => c.breed).filter(Boolean))).sort();
}

export function renameCatById(id, newName) {
  return request(`/api/cats/${id}`, { method: "PATCH", json: { name: newName } });
}

export function deleteCatById(id) {
  return request(`/api/cats/${id}`, { method: "DELETE", errorMessage: "Failed to delete cat." });
}

export function applyItem(catId, itemId) {
  return request(`/api/cats/${catId}/items/${itemId}`, {
    method: "POST",
    errorMessage: "Failed to apply item."
  });
}

export async function decreaseCatStat(catId, stat) {
  const data = await request(`/api/cats/${catId}/stats/${stat}/decrement`, {
    method: "POST",
    errorMessage: `Failed to decrease ${stat}`
  });
  return data?.cat;
}

/**
 * The cat's persona is built server-side from the stored cat, so only its id
 * travels with the prompt — stats and temperament are never client-supplied.
 */
export async function chatAsCat(prompt, catId) {
  const data = await request("/api/chat", {
    method: "POST",
    json: { prompt, catId },
    errorMessage: "CHAT_FAILED"
  });
  return data?.reply ?? "Zzz… 💤";
}

export function getRandomBreedWithImage() {
  return request("/api/breeds/random", { errorMessage: "BREEDS_LOAD_FAILED" });
}
