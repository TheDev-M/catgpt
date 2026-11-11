import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSseEvent } from "./useSseEvent.js";
import * as userApi from "@/services/userApi.js";

/** Minimal stand-in for EventSource; jsdom does not provide one. */
class FakeEventSource {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSED = 2;
  static instances = [];

  constructor(url) {
    this.url = url;
    this.readyState = FakeEventSource.CONNECTING;
    this.listeners = new Map();
    FakeEventSource.instances.push(this);
  }

  addEventListener(name, fn) {
    if (!this.listeners.has(name)) this.listeners.set(name, new Set());
    this.listeners.get(name).add(fn);
  }

  removeEventListener(name, fn) {
    this.listeners.get(name)?.delete(fn);
  }

  close() {
    this.readyState = FakeEventSource.CLOSED;
  }

  /** The server accepted the ticket. */
  simulateOpen() {
    this.readyState = FakeEventSource.OPEN;
    this.onopen?.();
  }

  /** The connection dropped, or the ticket was rejected. */
  simulateFailure() {
    this.readyState = FakeEventSource.CLOSED;
    this.onerror?.();
  }

  emit(name, data) {
    this.listeners.get(name)?.forEach((fn) => fn({ data }));
  }
}

describe("useSseEvent", () => {
  let ticketCount;

  beforeEach(() => {
    ticketCount = 0;
    FakeEventSource.instances = [];
    vi.stubGlobal("EventSource", FakeEventSource);
    localStorage.setItem("auth", JSON.stringify({ token: "test-token" }));
    vi.spyOn(userApi, "requestSseTicket").mockImplementation(async () => ({
      ticket: `ticket-${++ticketCount}`
    }));
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const flush = () => act(async () => { await Promise.resolve(); await Promise.resolve(); });

  it("opens one stream using a ticket from the server", async () => {
    renderHook(() => useSseEvent("friend-update", vi.fn()));
    await flush();

    expect(FakeEventSource.instances).toHaveLength(1);
    expect(FakeEventSource.instances[0].url).toContain("ticket=ticket-1");
  });

  it("delivers events to the subscriber", async () => {
    const handler = vi.fn();
    renderHook(() => useSseEvent("friend-update", handler));
    await flush();

    act(() => FakeEventSource.instances[0].emit("friend-update", "approved"));

    expect(handler).toHaveBeenCalledWith(expect.objectContaining({ data: "approved" }));
  });

  it("reopens with a fresh ticket after the stream fails", async () => {
    // Regression: tickets are single-use, so EventSource's own retry reuses a
    // spent ticket and always fails. Without an explicit reopen, live updates
    // stopped for good after the first dropped connection.
    renderHook(() => useSseEvent("friend-update", vi.fn()));
    await flush();

    act(() => FakeEventSource.instances[0].simulateOpen());
    act(() => FakeEventSource.instances[0].simulateFailure());

    await act(async () => { vi.advanceTimersByTime(1000); });
    await flush();

    expect(FakeEventSource.instances).toHaveLength(2);
    expect(FakeEventSource.instances[1].url).toContain("ticket=ticket-2");
  });

  it("backs off instead of retrying every second", async () => {
    renderHook(() => useSseEvent("friend-update", vi.fn()));
    await flush();

    // First failure retries after ~1s, the next after ~2s.
    act(() => FakeEventSource.instances[0].simulateFailure());
    await act(async () => { vi.advanceTimersByTime(1000); });
    await flush();
    expect(FakeEventSource.instances).toHaveLength(2);

    act(() => FakeEventSource.instances[1].simulateFailure());
    await act(async () => { vi.advanceTimersByTime(1000); });
    await flush();
    expect(FakeEventSource.instances).toHaveLength(2); // not yet

    await act(async () => { vi.advanceTimersByTime(1000); });
    await flush();
    expect(FakeEventSource.instances).toHaveLength(3);
  });

  it("stops reconnecting once the last subscriber unmounts", async () => {
    const { unmount } = renderHook(() => useSseEvent("friend-update", vi.fn()));
    await flush();

    act(() => FakeEventSource.instances[0].simulateFailure());
    unmount();

    await act(async () => { vi.advanceTimersByTime(60000); });
    await flush();

    expect(FakeEventSource.instances).toHaveLength(1);
  });

  it("does not open a stream without a token", async () => {
    localStorage.clear();

    renderHook(() => useSseEvent("friend-update", vi.fn()));
    await flush();

    expect(FakeEventSource.instances).toHaveLength(0);
  });
});
