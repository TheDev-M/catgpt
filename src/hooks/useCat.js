import { useCallback, useEffect, useState } from "react";
import { getCatById } from "@/services/catApi.js";

export function useCat(id) {
  const [cat, setCat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCat = useCallback(
    async ({ background = false } = {}) => {
      if (!id) {
        setCat(null);
        setLoading(false);
        setError(null);
        return;
      }

      if (!background) {
        setLoading(true);
      }

      try {
        const data = await getCatById(id);
        setCat(data);
        setError(null);
      } catch (e) {
        console.error(e);
        setError("Failed to load cat.");
        setCat(null);
      } finally {
        if (!background) {
          setLoading(false);
        }
      }
    },
    [id]
  );

  useEffect(() => {
    if (!id) {
      setCat(null);
      setLoading(false);
      setError(null);
      return;
    }
    void fetchCat();
  }, [id, fetchCat]);

  const refetch = useCallback((opts = {}) => fetchCat(opts), [fetchCat]);

  const updateCatSilently = useCallback((updatedCat) => {
    if (updatedCat) {
      setCat(updatedCat);
      setError(null);
    }
  }, []);

  return {
    cat,
    loading,
    error,
    refetch,
    updateCatSilently
  };
}
