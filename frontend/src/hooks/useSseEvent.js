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
const listeners = new Map(); // eventName -> Set<handler>
const forwarders = new Map(); // eventName -> the single listener attached to the EventSource

async function openStream() {
  if (eventSource && eventSource.readyState !== EventSource.CLOSED) return eventSource;
  if (connecting) return connecting;
  if (!getAuthToken()) return null;

  connecting = (async () => {
    try {
      const { ticket } = await requestSseTicket();
      const source = new EventSource(
        `${API_BASE_URL}/api/sse/events?ticket=${encodeURIComponent(ticket)}`
      );

      // A ticket is single-use, so the browser's automatic retry cannot
      // reconnect on its own — close the stream and let the next subscriber
      // (or a remount) open a fresh one with a new ticket.
      source.onerror = () => {
        if (source.readyState === EventSource.CLOSED) {
          if (eventSource === source) eventSource = null;
          forwarders.clear();
        }
      };

      eventSource = source;

      // Re-attach forwarders for anything subscribed while we were connecting.
      for (const eventName of listeners.keys()) {
        attachForwarder(eventName);
      }

      return source;
    } catch (e) {
      console.error("Failed to open live updates:", e);
      return null;
    } finally {
      connecting = null;
    }
  })();

  return connecting;
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
