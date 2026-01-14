import { useEffect, useState } from "react";
import { getRandomBreedWithImage } from "@/services/theCatApi.js";

export function useRandomBreedCat() {
  const [cat, setCat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getRandomBreedWithImage();

        const normalizedCat = {
          name: data.name,
          description: data.description,
          temperaments: data.temperament ? data.temperament.split(", ") : [],
          energy_level: data.energy_level,
          grooming: data.grooming,
          health_issues: data.health_issues,
          image: data.image
        };

        setCat(normalizedCat);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { cat, loading, error };
}
