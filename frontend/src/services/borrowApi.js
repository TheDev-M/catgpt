import { apiFetch } from "./apiClient.js";

async function handleResponse(res, fallback) {
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || fallback);
    }
    return res.status === 204 ? null : res.json();
}

export async function getFriendCats(friendshipId) {
    const res = await apiFetch(`/api/friends/${friendshipId}/cats`);
    return handleResponse(res, "Failed to load friend's cats.");
}

export async function borrowCat(catId) {
    const res = await apiFetch(`/api/cats/${catId}/borrow`, { method: "POST" });
    return handleResponse(res, "Failed to borrow cat.");
}

export async function returnCat(catId) {
    const res = await apiFetch(`/api/cats/${catId}/borrow`, { method: "DELETE" });
    return handleResponse(res, "Failed to return cat.");
}
