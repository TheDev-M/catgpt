import { useEffect, useState } from "react";
import { getAllCats } from "@/services/catApi.js";

export default function useCats() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, []);

  const hasDuplicateName = (name) =>
    cats.some((cat) => cat.name.toLowerCase() === name.trim().toLowerCase());

  return { cats, loading, error, hasDuplicateName };
}
