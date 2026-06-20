import { useCallback, useEffect, useState } from "react";
import { getAllCats } from "@/services/catApi.js";

export function useCats() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const refetch = useCallback(() => setFetchTrigger((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;

    async function fetchCats() {
      setLoading(true);
      setError(null);

      try {
        const data = await getAllCats();
        if (!cancelled) {
          setCats(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
          setCats([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchCats();

    return () => {
      cancelled = true;
    };
  }, [fetchTrigger]);

  const hasDuplicateName = (name) =>
    cats.some((cat) => cat.name.toLowerCase() === name.trim().toLowerCase());

  return { cats, loading, error, refetch, hasDuplicateName };
}
