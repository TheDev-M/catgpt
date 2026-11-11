import { useEffect, useRef } from "react";
import { API_BASE_URL, getAuthToken } from "@/services/apiClient.js";
import { requestSseTicket } from "@/services/userApi.js";

/**
 * One EventSource is shared by every subscriber in the app.
 *
 * Opening it needs a ticket from the server (EventSource cannot send an
 * Authorization header), so connecting is asynchronous and refcounted: the
 * stream opens on the first subscriber and closes when the last one leaves.
 */
let eventSource = null;
let connecting = null;
let subscriberCount = 0;
let reconnectTimer = null;
let reconnectAttempt = 0;
const listeners = new Map(); // eventName -> Set<handler>
const forwarders = new Map(); // eventName -> the single listener attached to the EventSource

const FIRST_RETRY_MS = 1000;
const MAX_RETRY_MS = 30000;

async function openStream() {
  if (eventSource && eventSource.readyState !== EventSource.CLOSED) return eventSource;
  if (connecting) return connecting;
  if (!getAuthToken() || subscriberCount <= 0) return null;

  connecting = (async () => {
    try {
      const { ticket } = await requestSseTicket();
      const source = new EventSource(
        `${API_BASE_URL}/api/sse/events?ticket=${encodeURIComponent(ticket)}`
      );

      source.onopen = () => {
        reconnectAttempt = 0;
      };

      // Tickets are single-use, so EventSource's own retry — which reuses the
      // same URL — always fails. The stream has to be reopened with a fresh
      // ticket instead, or live updates silently stop after the first blip.
      source.onerror = () => {
        if (source.readyState !== EventSource.CLOSED) return;

        source.close();
        if (eventSource === source) {
          eventSource = null;
          forwarders.clear();
        }
        scheduleReconnect();
      };

      eventSource = source;

      // Re-attach forwarders for anything subscribed while we were connecting.
      for (const eventName of listeners.keys()) {
        attachForwarder(eventName);
      }

      return source;
    } catch (e) {
      console.error("Failed to open live updates:", e);
      scheduleReconnect();
      return null;
    } finally {
      connecting = null;
    }
  })();

  return connecting;
}

/**
 * Backs off exponentially, so a server that is down (or asleep on a free tier)
 * is not hammered with a ticket request every second.
 */
function scheduleReconnect() {
  if (reconnectTimer || subscriberCount <= 0) return;

  const delay = Math.min(FIRST_RETRY_MS * 2 ** reconnectAttempt, MAX_RETRY_MS);
  reconnectAttempt++;

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    if (subscriberCount > 0) openStream();
  }, delay);
}

function attachForwarder(eventName) {
  if (!eventSource || forwarders.has(eventName)) return;

  const forward = (event) => {
    listeners.get(eventName)?.forEach((handler) => handler(event));
  };

  eventSource.addEventListener(eventName, forward);
  forwarders.set(eventName, forward);
}

function closeStream() {
  clearTimeout(reconnectTimer);
  reconnectTimer = null;
  reconnectAttempt = 0;
  eventSource?.close();
  eventSource = null;
  connecting = null;
  listeners.clear();
  forwarders.clear();
}

export function useSseEvent(eventName, handler) {
  // Held in a ref so an inline (un-memoised) handler from a caller does not
  // tear the shared stream down and reopen it on every render.
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const stableHandler = (event) => handlerRef.current?.(event);

    if (!listeners.has(eventName)) listeners.set(eventName, new Set());
    listeners.get(eventName).add(stableHandler);
    subscriberCount++;

    let cancelled = false;
    openStream().then(() => {
      if (!cancelled) attachForwarder(eventName);
    });

    return () => {
      cancelled = true;

      const handlers = listeners.get(eventName);
      handlers?.delete(stableHandler);
      subscriberCount--;

      if (handlers && handlers.size === 0) {
        const forward = forwarders.get(eventName);
        if (forward) eventSource?.removeEventListener(eventName, forward);
        forwarders.delete(eventName);
        listeners.delete(eventName);
      }

      if (subscriberCount <= 0) {
        subscriberCount = 0;
        closeStream();
      }
    };
  }, [eventName]);
}
