import { useEffect, useState } from "react";
import { getCatById } from "@/services/catApi.js";

export function useCat(id) {
  const [cat, setCat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setCat(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    
    async function fetchCat() {
      setLoading(true);
      setError(null);
      
      try {
        const data = await getCatById(id);
        if (!cancelled) {
          setCat(data);
        }
      } catch (e) {
        if (!cancelled) {
          console.error(e);
          setError("Failed to load cat.");
          setCat(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchCat();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { cat, loading, error };
}
