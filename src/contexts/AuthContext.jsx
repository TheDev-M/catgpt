import { createContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "@/services/userApi.js";
import { jwtDecode } from "jwt-decode";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

const STORAGE_KEY = "auth";

function isTokenValid(token) {
    try {
        const decoded = jwtDecode(token);

        if (!decoded || !decoded.exp) return true;

        return decoded.exp * 1000 > Date.now();
    } catch (e) {
        console.error("Failed to decode JWT", e);
        return false;
    }
}

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    function saveAuth(newToken, newUser) {
        setToken(newToken);
        setUser(newUser ?? null);

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ token: newToken, user: newUser ?? null })
        );
    }

    function clearAuth() {
        setToken(null);
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
    }

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                const storedToken = parsed?.token;

                if (storedToken && isTokenValid(storedToken)) {
                    setToken(storedToken);
                    setUser(parsed.user ?? null);
                } else {
                    clearAuth();
                }
            } catch (err) {
                console.error("Failed to restore auth:", err);
                clearAuth();
            }
        }

        setLoading(false);
    }, []);

    async function login(username, password) {
        const { token, user } = await loginUser(username, password);
        saveAuth(token, user);
    }

    async function register(username, password, description) {
        await registerUser(username, password, description);
        await login(username, password);
    }

    const logout = () => clearAuth();

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
