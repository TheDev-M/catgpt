import { apiFetch } from "./apiClient";

export async function getCurrentUser() {
    const res = await apiFetch("/api/user/me");

    if (!res.ok) {
        let serverMsg = "Failed to load current user.";
        const data = await res.json();
        serverMsg = data.message || data.error || serverMsg;
        const err = new Error(serverMsg);
        err.status = res.status;
        throw err;
    }

    return res.json();
}

export async function updateSelectedCat(selectedCatId) {
    const res = await apiFetch("/api/user/me/selected-cat", {
        method: "PATCH",
        body: JSON.stringify({ selectedCatId }),
    });

    if (!res.ok) {
        let serverMsg = "Failed to update selected cat.";
        const data = await res.json();
        serverMsg = data.message || data.error || serverMsg;
        const err = new Error(serverMsg);
        err.status = res.status;
        throw err;
    }

    return res.json();
}
