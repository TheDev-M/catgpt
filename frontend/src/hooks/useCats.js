import { useCallback, useEffect, useState } from "react";
import { getAllCats } from "@/services/catApi.js";

export default function useCats() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCats();
      setCats(data);
    } catch (err) {
      setError(err);
      setCats([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCats();
  }, [fetchCats]);

  const hasDuplicateName = (name) => cats.some(cat =>
      cat.name.toLowerCase() === name.trim().toLowerCase());

  return { cats, loading, error, refetch: () => fetchCats(), hasDuplicateName };
}
