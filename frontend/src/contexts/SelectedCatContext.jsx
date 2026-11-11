import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth.js";
import { getCurrentUser, updateSelectedCat } from "@/services/userApi.js";
import { SelectedCatContext } from "./selectedCatContextObject.js";

function getStorageKey(userId) {
  return userId ? `selectedCatId:${userId}` : null;
}

export function SelectedCatProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [selectedCatId, setSelectedCatIdState] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = user?.id;

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      setSelectedCatIdState(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const storageKey = getStorageKey(userId);
    const stored = storageKey ? localStorage.getItem(storageKey) : null;

    if (stored) {
      setSelectedCatIdState(stored);
    }

    getCurrentUser()
      .then((currentUser) => {
        if (cancelled) return;
        const id = currentUser.selectedCatId ? String(currentUser.selectedCatId) : null;
        setSelectedCatIdState(id);
        if (storageKey && id) {
          localStorage.setItem(storageKey, id);
        }
      })
      .catch((err) => {
        if (!cancelled) console.error("Failed to load selected cat:", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // Keyed on the user's id, not the user object: refreshUser() replaces that
    // object on every call, which would re-trigger this fetch indefinitely.
  }, [isAuthenticated, userId]);

  const setSelectedCatId = useCallback(async (id) => {
    const idStr = id ? String(id) : null;
    setSelectedCatIdState(idStr);

    const storageKey = getStorageKey(userId);
    if (storageKey) {
      if (idStr) {
        localStorage.setItem(storageKey, idStr);
      } else {
        localStorage.removeItem(storageKey);
      }
    }

    if (isAuthenticated) {
      try {
        await updateSelectedCat(id ? Number(id) : null);
      } catch (err) {
        console.error("Failed to update selected cat:", err);
      }
    }
  }, [userId, isAuthenticated]);

  return (
    <SelectedCatContext.Provider value={{ selectedCatId, setSelectedCatId, loading }}>
      {children}
    </SelectedCatContext.Provider>
  );
}
