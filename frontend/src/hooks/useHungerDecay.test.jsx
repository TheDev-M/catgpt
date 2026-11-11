import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useHungerDecay } from "./useHungerDecay.js";
import { GAME_CONFIG } from "@/config/gameConfig.js";
import * as catApi from "@/services/catApi.js";

describe("useHungerDecay", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(catApi, "decreaseCatStat").mockResolvedValue({});
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("decays hunger once the interval elapses", async () => {
    const onCatUpdated = vi.fn();
    renderHook(() => useHungerDecay(1, onCatUpdated));

    await act(async () => {
      vi.advanceTimersByTime(GAME_CONFIG.decay.hungerInterval);
    });

    expect(catApi.decreaseCatStat).toHaveBeenCalledWith(1, "hunger");
  });

  it("still decays when the component re-renders in between", async () => {
    // Regression: with a non-memoised onCatUpdated the effect re-ran on every
    // render, resetting the interval so the tick never completed.
    const onCatUpdated = vi.fn();
    const { rerender } = renderHook(() => useHungerDecay(1, onCatUpdated));

    const step = GAME_CONFIG.decay.hungerInterval / 4;
    for (let i = 0; i < 4; i++) {
      await act(async () => {
        vi.advanceTimersByTime(step);
      });
      rerender();
    }

    expect(catApi.decreaseCatStat).toHaveBeenCalledWith(1, "hunger");
  });

  it("does nothing without a selected cat", async () => {
    renderHook(() => useHungerDecay(null, vi.fn()));

    await act(async () => {
      vi.advanceTimersByTime(GAME_CONFIG.decay.hungerInterval * 2);
    });

    expect(catApi.decreaseCatStat).not.toHaveBeenCalled();
  });

  it("stops decaying after unmount", async () => {
    const { unmount } = renderHook(() => useHungerDecay(1, vi.fn()));
    unmount();

    await act(async () => {
      vi.advanceTimersByTime(GAME_CONFIG.decay.hungerInterval * 3);
    });

    expect(catApi.decreaseCatStat).not.toHaveBeenCalled();
  });
});
