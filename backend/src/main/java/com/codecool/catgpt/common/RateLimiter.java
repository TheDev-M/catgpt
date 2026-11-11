package com.codecool.catgpt.common;

import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * A small in-memory fixed-window rate limiter, used to keep authenticated users
 * from draining paid upstream quotas (Groq, TheCatAPI).
 * <p>
 * State lives in this JVM only, so it does not survive a restart and does not
 * coordinate across instances. That is enough for a single-instance deployment;
 * a multi-instance setup would want this backed by Redis instead.
 */
@Component
public class RateLimiter {

    /** Above this many tracked keys, expired windows are pruned before admitting more. */
    private static final int MAX_TRACKED_KEYS = 10_000;

    private final Map<String, Window> windows = new ConcurrentHashMap<>();

    /**
     * Records one hit against {@code key} and reports whether it is within budget.
     *
     * @return true if the call is allowed, false if the limit for the current window is exceeded
     */
    public boolean tryAcquire(String key, int limit, Duration window) {
        long now = System.nanoTime();
        long windowNanos = window.toNanos();

        Window current = windows.compute(key, (k, existing) ->
                (existing == null || now - existing.startedAt() >= windowNanos)
                        ? new Window(now, 1)
                        : new Window(existing.startedAt(), existing.hits() + 1));

        if (windows.size() > MAX_TRACKED_KEYS) {
            windows.values().removeIf(w -> now - w.startedAt() >= windowNanos);
        }

        return current.hits() <= limit;
    }

    private record Window(long startedAt, int hits) {}
}
