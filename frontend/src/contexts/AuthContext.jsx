import { createContext, useEffect, useRef, useState } from "react";
import { loginUser, registerUser, getCurrentUser } from "@/services/userApi.js";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext(null);

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

  const clearAuth = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  };

  const saveAuth = (newToken, newUser) => {
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
  };

  const login = async (username, password) => {
    const { token: newToken, user: newUser } = await loginUser(username, password);
    saveAuth(newToken, newUser);
  };

  const register = async (username, password, description) => {
    await registerUser(username, password, description);
    const { token: newToken, user: newUser } = await loginUser(username, password);
    saveAuth(newToken, newUser);
  };

  // Completes login for a JWT obtained from the Google OAuth2 redirect
  // (see OAuthCallbackPage). The backend has already verified the user;
  // we just need to fetch their profile and persist the session locally.
  const loginWithOAuthToken = async (newToken) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: newToken, user: null }));
    try {
      const me = await getCurrentUser();
      saveAuth(newToken, me);
    } catch (err) {
      clearAuth();
      throw err;
    }
  };

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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        isAuthenticated: Boolean(token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
