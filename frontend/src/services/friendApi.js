import { request } from "./apiClient.js";

export function getFriends() {
    return request("/api/friends", { errorMessage: "Failed to load friends." });
}

export function getIncomingRequests() {
    return request("/api/friends/requests/incoming", { errorMessage: "Failed to load requests." });
}

export function getOutgoingRequests() {
    return request("/api/friends/requests/outgoing", { errorMessage: "Failed to load outgoing requests." });
}

export function sendFriendRequest(username) {
    return request("/api/friends/request", {
        method: "POST",
        json: { username },
        errorMessage: "Failed to send friend request."
    });
}

export function approveRequest(friendshipId) {
    return request(`/api/friends/${friendshipId}/approve`, {
        method: "PATCH",
        errorMessage: "Failed to approve request."
    });
}

export function declineRequest(friendshipId) {
    return request(`/api/friends/${friendshipId}/decline`, {
        method: "PATCH",
        errorMessage: "Failed to decline request."
    });
}

export function removeFriend(friendshipId) {
    return request(`/api/friends/${friendshipId}`, {
        method: "DELETE",
        errorMessage: "Failed to remove friend."
    });
}
