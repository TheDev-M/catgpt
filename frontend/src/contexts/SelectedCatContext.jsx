// SelectedCatContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth.js";
import { getCurrentUser, updateSelectedCat } from "@/services/userApi.js";

// eslint-disable-next-line react-refresh/only-export-components
export const SelectedCatContext = createContext(null);

function getStorageKeyForUser(user) {
    if (!user?.id) return null;
    return `selectedCatId:${user.id}`;
}

export function SelectedCatProvider({ children }) {
    const { user, isAuthenticated } = useAuth();
    const [selectedCatId, setSelectedCatIdState] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            if (!isAuthenticated || !user) {
                setSelectedCatIdState(null);
                setLoading(false);
                return;
            }

            setLoading(true);

            // 1) try localStorage per user (fast)
            const storageKey = getStorageKeyForUser(user);
            if (storageKey) {
                const stored = localStorage.getItem(storageKey);
                if (stored) {
                    setSelectedCatIdState(stored);
                    setLoading(false);
                }
            }

            try {
                const currentUser = await getCurrentUser();
                const id = currentUser.selectedCatId ?? null;
                const idStr = id != null ? String(id) : null;
                setSelectedCatIdState(idStr);

                if (storageKey && idStr != null) {
                    localStorage.setItem(storageKey, idStr);
                }
            } catch (err) {
                console.error("Failed to load selected cat from backend:", err);
            } finally {
                setLoading(false);
            }
        }

        void load();
    }, [isAuthenticated, user]);

    const setSelectedCatId = async (id) => {
        setSelectedCatIdState(id);

        if (user) {
            const storageKey = getStorageKeyForUser(user);
            if (storageKey) {
                if (id != null) {
                    localStorage.setItem(storageKey, id);
                } else {
                    localStorage.removeItem(storageKey);
                }
            }
        }

        if (!isAuthenticated) return;

        try {
            await updateSelectedCat(id != null ? Number(id) : null);
        } catch (err) {
            console.error("Failed to update selected cat on backend:", err);
        }
    };

    const value = {
        selectedCatId,
        setSelectedCatId,
        loading,
    };

    return (
        <SelectedCatContext.Provider value={value}>
            {children}
        </SelectedCatContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSelectedCat() {
    const ctx = useContext(SelectedCatContext);
    if (!ctx) {
        throw new Error("useSelectedCat must be used within <SelectedCatProvider>");
    }
    return ctx;
}
