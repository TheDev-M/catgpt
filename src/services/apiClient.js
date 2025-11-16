const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const STORAGE_KEY = "auth";

function getAuthToken() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.token ?? null;
  } catch {
    return null;
  }
}

export async function apiFetch(url, options = {}) {
  const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  return fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers
  });
}
