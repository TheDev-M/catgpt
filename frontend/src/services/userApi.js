import { apiFetch } from "./apiClient.js";

export async function loginUser(username, password) {
    const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || data.error || "LOGIN_FAILED");
    }

    return res.json();
}

export async function registerUser(username, password, description) {
    const res = await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, password, description })
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || data.error || "REGISTER_FAILED");
    }

    return res.json();
}

export async function getCurrentUser() {
    const res = await apiFetch("/api/user/me");

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || data.error || "FAILED_TO_LOAD_USER");
    }

    return res.json();
}

export async function updateSelectedCat(selectedCatId) {
    const res = await apiFetch("/api/user/me/selected-cat", {
        method: "PATCH",
        body: JSON.stringify({ selectedCatId })
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || data.error || "FAILED_TO_UPDATE_SELECTED_CAT");
    }

    return res.json();
}

export async function updateNickname(nickname) {
    const res = await apiFetch("/api/user/me/nickname", {
        method: "PATCH",
        body: JSON.stringify({ nickname })
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to update nickname.");
    }

    return res.json();
}

export async function changePassword(currentPassword, newPassword) {
    const res = await apiFetch("/api/user/me/password", {
        method: "PATCH",
        body: JSON.stringify({ currentPassword, newPassword })
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to change password.");
    }
}
