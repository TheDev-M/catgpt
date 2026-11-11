import { useCallback, useEffect, useRef, useState } from "react";
import { loginUser, registerUser, getCurrentUser } from "@/services/userApi.js";
import { UNAUTHORIZED_EVENT } from "@/services/apiClient.js";
import { AuthContext } from "./authContextObject.js";
import { jwtDecode } from "jwt-decode";

const STORAGE_KEY = "auth";

function getTokenExpiry(token) {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const logoutTimerRef = useRef(null);

  const clearAuth = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  }, []);

  const saveAuth = useCallback((newToken, newUser) => {
    setToken(newToken);
    setUser(newUser || null);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: newToken, user: newUser }));

    // Auto-logout on token expiry
    const expiryMs = getTokenExpiry(newToken);
    if (expiryMs) {
      const msLeft = expiryMs - Date.now();
      if (msLeft > 0) {
        if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
        logoutTimerRef.current = setTimeout(clearAuth, msLeft);
      } else {
        clearAuth();
      }
    }
  }, [clearAuth]);

  const login = useCallback(async (username, password) => {
    const { token: newToken, user: newUser } = await loginUser(username, password);
    saveAuth(newToken, newUser);
  }, [saveAuth]);

  const register = useCallback(async (username, password, description) => {
    await registerUser(username, password, description);
    const { token: newToken, user: newUser } = await loginUser(username, password);
    saveAuth(newToken, newUser);
  }, [saveAuth]);

  const refreshUser = useCallback(async () => {
    try {
      const me = await getCurrentUser();
      setUser(me);
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...parsed, user: me }));
      }
      return me;
    } catch {
      // ignore — stale user data is acceptable
    }
  }, []);

  // Completes login for a JWT obtained from the Google OAuth2 redirect
  // (see OAuthCallbackPage). The backend has already verified the user;
  // we just need to fetch their profile and persist the session locally.
  const loginWithOAuthToken = useCallback(async (newToken) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: newToken, user: null }));
    try {
      const me = await getCurrentUser();
      saveAuth(newToken, me);
    } catch (err) {
      clearAuth();
      throw err;
    }
  }, [saveAuth, clearAuth]);

  // Restore auth from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        const { token: storedToken, user: storedUser } = JSON.parse(stored);
        const expiryMs = getTokenExpiry(storedToken);

        if (storedToken && expiryMs && expiryMs > Date.now()) {
          saveAuth(storedToken, storedUser);
        } else {
          clearAuth();
        }
      } catch {
        clearAuth();
      }
    }

    setLoading(false);

    return () => {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };
  }, [saveAuth, clearAuth]);

  // The API client raises this whenever the server rejects our token, so a
  // revoked or server-side-expired session logs out everywhere at once rather
  // than failing request by request.
  useEffect(() => {
    window.addEventListener(UNAUTHORIZED_EVENT, clearAuth);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, clearAuth);
  }, [clearAuth]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        register,
        loginWithOAuthToken,
        logout: clearAuth,
        refreshUser,
        isAuthenticated: Boolean(token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
