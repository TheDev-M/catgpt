import { apiFetch } from "./apiClient.js";

async function handleResponse(res, fallback) {
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || fallback);
    }
    return res.status === 204 ? null : res.json();
}

export async function getFriends() {
    const res = await apiFetch("/api/friends");
    return handleResponse(res, "Failed to load friends.");
}

export async function getIncomingRequests() {
    const res = await apiFetch("/api/friends/requests/incoming");
    return handleResponse(res, "Failed to load requests.");
}

export async function getOutgoingRequests() {
    const res = await apiFetch("/api/friends/requests/outgoing");
    return handleResponse(res, "Failed to load outgoing requests.");
}

export async function sendFriendRequest(username) {
    const res = await apiFetch("/api/friends/request", {
        method: "POST",
        body: JSON.stringify({ username })
    });
    return handleResponse(res, "Failed to send friend request.");
}

export async function approveRequest(friendshipId) {
    const res = await apiFetch(`/api/friends/${friendshipId}/approve`, { method: "PATCH" });
    return handleResponse(res, "Failed to approve request.");
}

export async function declineRequest(friendshipId) {
    const res = await apiFetch(`/api/friends/${friendshipId}/decline`, { method: "PATCH" });
    return handleResponse(res, "Failed to decline request.");
}

export async function removeFriend(friendshipId) {
    const res = await apiFetch(`/api/friends/${friendshipId}`, { method: "DELETE" });
    return handleResponse(res, "Failed to remove friend.");
}
