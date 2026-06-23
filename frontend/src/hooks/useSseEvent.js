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

let sharedEs = null;
let listeners = {};
let refCount = 0;

function getSharedEventSource() {
    if (sharedEs && sharedEs.readyState !== EventSource.CLOSED) return sharedEs;
    const token = getAuthToken();
    if (!token) return null;
    sharedEs = new EventSource(`${API_BASE_URL}/api/sse/events?token=${encodeURIComponent(token)}`);
    sharedEs.onerror = () => {};
    return sharedEs;
}

export function useSseEvent(eventName, handler) {
    useEffect(() => {
        const es = getSharedEventSource();
        if (!es) return;

        if (!listeners[eventName]) listeners[eventName] = new Set();
        listeners[eventName].add(handler);
        refCount++;

        const wrappedHandler = (e) => {
            listeners[eventName]?.forEach(fn => fn(e));
        };

        if (listeners[eventName].size === 1) {
            es.addEventListener(eventName, wrappedHandler);
            listeners[`__raw_${eventName}`] = wrappedHandler;
        }

        return () => {
            listeners[eventName]?.delete(handler);
            refCount--;
            if (listeners[eventName]?.size === 0) {
                es.removeEventListener(eventName, listeners[`__raw_${eventName}`]);
                delete listeners[eventName];
                delete listeners[`__raw_${eventName}`];
            }
            if (refCount <= 0) {
                sharedEs?.close();
                sharedEs = null;
                listeners = {};
                refCount = 0;
            }
        };
    }, [eventName, handler]);
}
