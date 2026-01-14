import { useCallback, useEffect, useState } from "react";
import { getAllItems } from "@/services/itemsApi.js";
import { applyItem } from "@/services/catApi.js";

export function useInventory(selectedCatId, { onCatUpdated } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingId, setUsingId] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async ({ background = false } = {}) => {
    if (!background) setLoading(true);
    setError(null);

    try {
      const data = await getAllItems();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError("Failed to load items.");
      setItems([]);
    } finally {
      if (!background) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const useItem = useCallback(
    async (item) => {
      if (!selectedCatId || !item?.id) return;

      setError(null);
      setUsingId(item.id);

      try {
        const updatedCat = await applyItem(selectedCatId, item.id);
        await load({ background: true });
        onCatUpdated?.(updatedCat);
      } catch (e) {
        console.error(e);
        setError("Failed to use item.");
      } finally {
        setUsingId(null);
      }
    },
    [selectedCatId, load, onCatUpdated]
  );

  return {
    items,
    loading,
    error,
    usingId,
    useItem,
    reload: load
  };
}
