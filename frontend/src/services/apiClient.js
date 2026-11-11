const envValue = import.meta.env.VITE_API_BASE_URL;
export const API_BASE_URL = envValue === "PROXY" ? "" : (envValue || "http://localhost:8080");

const STORAGE_KEY = "auth";

/** Dispatched when the server rejects our token, so AuthContext can clear the session. */
export const UNAUTHORIZED_EVENT = "catgpt:unauthorized";

export function getAuthToken() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.token ?? null;
  } catch {
    return null;
  }
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch(url, options = {}) {
  const token = getAuthToken();

  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  // Only declare a JSON body when there is one. Setting Content-Type on a bodyless
  // GET or DELETE makes it a non-simple request, which costs a CORS preflight on
  // every single call once the frontend and API are on different origins.
  if (options.body !== undefined && headers["Content-Type"] === undefined) {
    headers["Content-Type"] = "application/json";
  }

  return fetch(`${API_BASE_URL}${url}`, { ...options, headers });
}

/**
 * Reads an error message out of a failed response.
 * Falls back cleanly when the body is not JSON — a 502 from a proxy is usually
 * an HTML page, and parsing it would throw a SyntaxError over the real cause.
 */
async function extractErrorMessage(res, fallback) {
  try {
    const data = await res.json();
    return data?.message || data?.error || fallback;
  } catch {
    return fallback;
  }
}

/**
 * The single entry point for talking to the API.
 *
 * @param {string} url path beginning with /api
 * @param {object} [options] fetch options; `json` is serialised as the body
 * @param {string} [options.errorMessage] fallback message when the server sends none
 * @returns parsed JSON, or null for an empty (204) response
 * @throws {ApiError} on any non-2xx response
 */
export async function request(url, { json: jsonBody, errorMessage = "Request failed.", ...options } = {}) {
  const res = await apiFetch(url, {
    ...options,
    ...(jsonBody !== undefined ? { body: JSON.stringify(jsonBody) } : {})
  });

  if (!res.ok) {
    if (res.status === 401) {
      // The token is gone or no longer accepted — tear the session down once,
      // centrally, instead of letting every caller fail in its own way.
      window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT));
    }
    throw new ApiError(await extractErrorMessage(res, errorMessage), res.status);
  }

  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return null;
  }

  return res.json();
}
