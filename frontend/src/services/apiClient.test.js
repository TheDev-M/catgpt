import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, request, UNAUTHORIZED_EVENT } from "./apiClient.js";

function mockResponse({ ok = true, status = 200, body = {}, text = null, headers = {} } = {}) {
  return {
    ok,
    status,
    headers: { get: (key) => headers[key] ?? null },
    json: async () => {
      if (text !== null) throw new SyntaxError("Unexpected token '<'");
      return body;
    }
  };
}

describe("request", () => {
  beforeEach(() => {
    localStorage.setItem("auth", JSON.stringify({ token: "test-token" }));
  });

  it("sends the bearer token", async () => {
    const fetchMock = vi.fn().mockResolvedValue(mockResponse({ body: { ok: true } }));
    vi.stubGlobal("fetch", fetchMock);

    await request("/api/cats");

    const [, options] = fetchMock.mock.calls[0];
    expect(options.headers.Authorization).toBe("Bearer test-token");
  });

  it("omits Content-Type when there is no body, to avoid a CORS preflight", async () => {
    const fetchMock = vi.fn().mockResolvedValue(mockResponse({ body: [] }));
    vi.stubGlobal("fetch", fetchMock);

    await request("/api/cats");

    const [, options] = fetchMock.mock.calls[0];
    expect(options.headers["Content-Type"]).toBeUndefined();
  });

  it("sets Content-Type and serialises the body when one is given", async () => {
    const fetchMock = vi.fn().mockResolvedValue(mockResponse({ body: {} }));
    vi.stubGlobal("fetch", fetchMock);

    await request("/api/cats", { method: "POST", json: { name: "Luna" } });

    const [, options] = fetchMock.mock.calls[0];
    expect(options.headers["Content-Type"]).toBe("application/json");
    expect(options.body).toBe(JSON.stringify({ name: "Luna" }));
  });

  it("throws an ApiError carrying the server's message", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      mockResponse({ ok: false, status: 400, body: { message: "You already have a cat named Luna." } })
    ));

    await expect(request("/api/cats", { method: "POST", json: {} }))
      .rejects.toThrow("You already have a cat named Luna.");
  });

  it("falls back to the given message when the error body is not JSON", async () => {
    // A 502 from a proxy is an HTML page; parsing it must not mask the real failure.
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      mockResponse({ ok: false, status: 502, text: "<html>Bad Gateway</html>" })
    ));

    await expect(request("/api/cats", { errorMessage: "FAILED_TO_LOAD_CATS" }))
      .rejects.toThrow("FAILED_TO_LOAD_CATS");
  });

  it("exposes the status code on the error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse({ ok: false, status: 403, body: {} })));

    await expect(request("/api/cats/9")).rejects.toMatchObject({
      name: "ApiError",
      status: 403
    });
  });

  it("announces a 401 so the session can be cleared centrally", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse({ ok: false, status: 401, body: {} })));

    const onUnauthorized = vi.fn();
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);

    await expect(request("/api/user/me")).rejects.toBeInstanceOf(ApiError);
    expect(onUnauthorized).toHaveBeenCalledOnce();

    window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  });

  it("returns null for a 204 instead of trying to parse a body", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse({ status: 204 })));

    await expect(request("/api/cats/1", { method: "DELETE" })).resolves.toBeNull();
  });
});
