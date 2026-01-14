import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { loginUser, registerUser } from "@/services/userApi.js";
import { jwtDecode } from "jwt-decode";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

const STORAGE_KEY = "auth";

function decodeExp(token) {
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

    const clearLogoutTimer = useCallback(() => {
        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current);
            logoutTimerRef.current = null;
        }
    }, []);

    const clearAuth = useCallback(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
        clearLogoutTimer();
    }, [clearLogoutTimer]);

    const scheduleAutoLogout = useCallback(
        (tokenToSchedule) => {
            clearLogoutTimer();

            if (!tokenToSchedule) return;

            const expiryMs = decodeExp(tokenToSchedule);
            if (!expiryMs) return;

            const msLeft = expiryMs - Date.now();
            if (msLeft <= 0) {
                clearAuth();
                return;
            }

            logoutTimerRef.current = setTimeout(() => {
                clearAuth();
            }, msLeft);
        },
        [clearAuth, clearLogoutTimer]
    );

    const saveAuth = useCallback(
        (newToken, newUser) => {
            setToken(newToken);
            setUser(newUser ?? null);

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ token: newToken, user: newUser ?? null })
            );

            scheduleAutoLogout(newToken);
        },
        [scheduleAutoLogout]
    );

    const login = useCallback(
        async (username, password) => {
            const { token: newToken, user: newUser } = await loginUser(
                username,
                password
            );
            saveAuth(newToken, newUser);
        },
        [saveAuth]
    );

    const register = useCallback(
        async (username, password, description) => {
            await registerUser(username, password, description);
            const { token: newToken, user: newUser } = await loginUser(
                username,
                password
            );
            saveAuth(newToken, newUser);
        },
        [saveAuth]
    );

    const logout = useCallback(() => {
        clearAuth();
    }, [clearAuth]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                const storedToken = parsed.token;

                const expiryMs = decodeExp(storedToken);

                if (storedToken && expiryMs && expiryMs > Date.now()) {
                    setToken(storedToken);
                    setUser(parsed.user ?? null);
                    scheduleAutoLogout(storedToken);
                } else {
                    clearAuth();
                }
            } catch {
                clearAuth();
            }
        }

        setLoading(false);

        return () => clearLogoutTimer();
    }, [clearAuth, clearLogoutTimer, scheduleAutoLogout]);

    const value = {
        token,
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: Boolean(token),
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
