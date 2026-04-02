import { useEffect, useState } from "react";
import { getAllItems } from "@/services/itemsApi.js";
import { applyItem } from "@/services/catApi.js";

export function useInventory(selectedCatId, onCatUpdated) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingId, setUsingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadItems() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllItems();
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) {
          console.error(e);
          setError("Failed to load items.");
          setItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (selectedCatId) loadItems();
    else {
      setItems([]);
      setLoading(false);
    }

    return () => (cancelled = true);
  }, [selectedCatId]);

  const addItem = (newItem) => {
    if (!newItem?.id) return;

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === newItem.id);

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          availableAmount: (updated[existingIndex].availableAmount ?? 0) + 1
        };
        return updated;
      }

      return [...prev, { ...newItem, availableAmount: 1 }];
    });
  };

  const useItem = async (item) => {
    if (!selectedCatId || !item?.id) return;

    setUsingId(item.id);

    try {
      setItems((prev) =>
        prev
          .map((i) =>
            i.id === item.id
              ? { ...i, availableAmount: (i.availableAmount ?? 0) - 1 }
              : i
          )
          .filter((i) => (i.availableAmount ?? 0) > 0)
      );

      const updatedCat = await applyItem(selectedCatId, item.id);
      onCatUpdated?.(updatedCat);
    } catch (e) {
      console.error(e);
    } finally {
      setUsingId(null);
    }
  };

  return { items, loading, error, usingId, addItem, useItem };
}
