import { request } from "./apiClient.js";

export function loginUser(username, password) {
    return request("/api/auth/login", {
        method: "POST",
        json: { username, password },
        errorMessage: "LOGIN_FAILED"
    });
}

export function registerUser(username, password, description) {
    return request("/api/auth/register", {
        method: "POST",
        json: { username, password, description },
        errorMessage: "REGISTER_FAILED"
    });
}

export function getCurrentUser() {
    return request("/api/user/me", { errorMessage: "FAILED_TO_LOAD_USER" });
}

export function updateSelectedCat(selectedCatId) {
    return request("/api/user/me/selected-cat", {
        method: "PATCH",
        json: { selectedCatId },
        errorMessage: "FAILED_TO_UPDATE_SELECTED_CAT"
    });
}

export function updateNickname(nickname) {
    return request("/api/user/me/nickname", {
        method: "PATCH",
        json: { nickname },
        errorMessage: "Failed to update nickname."
    });
}

export function changePassword(currentPassword, newPassword) {
    return request("/api/user/me/password", {
        method: "PATCH",
        json: { currentPassword, newPassword },
        errorMessage: "Failed to change password."
    });
}

/** Exchanges the session token for a short-lived, single-use SSE stream ticket. */
export function requestSseTicket() {
    return request("/api/sse/ticket", {
        method: "POST",
        errorMessage: "Failed to open live updates."
    });
}
