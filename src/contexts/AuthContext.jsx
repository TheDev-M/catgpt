import { createContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "@/services/userApi.js";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

const STORAGE_KEY = "auth";

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed?.token) {
                setToken(parsed.token);
                setUser(parsed.user ?? null);
            }
        }
        setLoading(false);
    }, []);

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
        isAuthenticated: Boolean(token)
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
