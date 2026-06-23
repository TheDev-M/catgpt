import { useEffect } from "react";
import { API_BASE_URL } from "@/services/apiClient.js";

function getAuthToken() {
    try {
        const raw = localStorage.getItem("auth");
        return raw ? JSON.parse(raw)?.token ?? null : null;
    } catch {
        return null;
    }
}

export function useFriendUpdates(onUpdate) {
    useEffect(() => {
        const token = getAuthToken();
        if (!token) return;

        const url = `${API_BASE_URL}/api/sse/events?token=${encodeURIComponent(token)}`;
        const es = new EventSource(url);

        es.addEventListener("friend-update", () => {
            onUpdate();
        });

        es.onerror = () => {
            // EventSource reconnects automatically; nothing to do
        };

        return () => es.close();
    }, [onUpdate]);
}
