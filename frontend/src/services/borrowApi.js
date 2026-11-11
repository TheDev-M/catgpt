import { request } from "./apiClient.js";

export function getFriendCats(friendshipId) {
    return request(`/api/friends/${friendshipId}/cats`, {
        errorMessage: "Failed to load friend's cats."
    });
}

export function borrowCat(catId) {
    return request(`/api/cats/${catId}/borrow`, {
        method: "POST",
        errorMessage: "Failed to borrow cat."
    });
}

export function returnCat(catId) {
    return request(`/api/cats/${catId}/borrow`, {
        method: "DELETE",
        errorMessage: "Failed to return cat."
    });
}
