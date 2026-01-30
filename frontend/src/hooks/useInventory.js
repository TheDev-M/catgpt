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
        if (!cancelled) {
          setItems(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        if (!cancelled) {
          console.error(e);
          setError("Failed to load items.");
          setItems([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadItems();

    return () => {
      cancelled = true;
    };
  }, [selectedCatId]);

  const useItem = async (item) => {
    if (!selectedCatId || !item?.id) return;

    setError(null);
    setUsingId(item.id);

    try {
      const updatedCat = await applyItem(selectedCatId, item.id);
      const data = await getAllItems();
      setItems(Array.isArray(data) ? data : []);
      onCatUpdated?.(updatedCat);
    } catch (e) {
      console.error(e);
      setError("Failed to use item.");
    } finally {
      setUsingId(null);
    }
  };

  return { items, loading, error, usingId, useItem };
}
