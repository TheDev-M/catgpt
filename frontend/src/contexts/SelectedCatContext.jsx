import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth.js";
import { getCurrentUser, updateSelectedCat } from "@/services/userApi.js";

export const SelectedCatContext = createContext(null);

function getStorageKey(userId) {
  return userId ? `selectedCatId:${userId}` : null;
}

export function SelectedCatProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [selectedCatId, setSelectedCatIdState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setSelectedCatIdState(null);
      setLoading(false);
      return;
    }

    const storageKey = getStorageKey(user.id);
    const stored = storageKey ? localStorage.getItem(storageKey) : null;

    if (stored) {
      setSelectedCatIdState(stored);
    }

    getCurrentUser()
      .then((currentUser) => {
        const id = currentUser.selectedCatId ? String(currentUser.selectedCatId) : null;
        setSelectedCatIdState(id);
        if (storageKey && id) {
          localStorage.setItem(storageKey, id);
        }
      })
      .catch((err) => console.error("Failed to load selected cat:", err))
      .finally(() => setLoading(false));
  }, [isAuthenticated, user]);

  const setSelectedCatId = async (id) => {
    const idStr = id ? String(id) : null;
    setSelectedCatIdState(idStr);

    const storageKey = getStorageKey(user?.id);
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
  };

  return (
    <SelectedCatContext.Provider value={{ selectedCatId, setSelectedCatId, loading }}>
      {children}
    </SelectedCatContext.Provider>
  );
}

export function useSelectedCat() {
  const ctx = useContext(SelectedCatContext);
  if (!ctx) {
    throw new Error("useSelectedCat must be used within <SelectedCatProvider>");
  }
  return ctx;
}
