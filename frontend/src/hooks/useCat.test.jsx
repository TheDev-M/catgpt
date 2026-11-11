import { describe, expect, it, vi, beforeEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useCat } from "./useCat.js";
import * as catApi from "@/services/catApi.js";

describe("useCat", () => {
  beforeEach(() => {
    vi.spyOn(catApi, "getCatById").mockResolvedValue({
      id: 1,
      name: "Bob",
      stats: { hunger: 7, mood: 9, health: 7 }
    });
  });

  it("loads the cat for the given id", async () => {
    const { result } = renderHook(() => useCat(1));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.cat.name).toBe("Bob");
    expect(result.current.error).toBeNull();
  });

  it("keeps updateCat stable across renders", async () => {
    // useHungerDecay lists this in its effect deps: if the identity changed on
    // every render the decay interval would restart before it could ever fire.
    const { result, rerender } = renderHook(() => useCat(1));
    await waitFor(() => expect(result.current.loading).toBe(false));

    const first = result.current.updateCat;
    rerender();
    rerender();

    expect(result.current.updateCat).toBe(first);
  });

  it("supports functional updates", async () => {
    const { result } = renderHook(() => useCat(1));
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.updateCat((prev) => ({ ...prev, name: "Luna" }));
    });

    expect(result.current.cat.name).toBe("Luna");
  });

  it("reports an error when the cat cannot be loaded", async () => {
    vi.spyOn(catApi, "getCatById").mockRejectedValue(new Error("FAILED_TO_LOAD_CAT"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() => useCat(99));

    await waitFor(() => expect(result.current.error).toBe("Failed to load cat."));
    expect(result.current.cat).toBeNull();
  });

  it("does not fetch without an id", async () => {
    const { result } = renderHook(() => useCat(null));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(catApi.getCatById).not.toHaveBeenCalled();
    expect(result.current.cat).toBeNull();
  });
});
