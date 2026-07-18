import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCats } from "@/hooks/useCats.js";
import { getBreedsFromCats } from "@/services/catApi.js";

import CatBoxHeader from "@/components/CatBoxHeader/CatBoxHeader.jsx";
import CatBoxGrid from "@/components/CatBoxGrid/CatBoxGrid.jsx";
import SkeletonGrid from "@/components/CatBoxGrid/SkeletonGrid.jsx";
import ErrorMessage from "@/components/Errors/ErrorMessage.jsx";

export default function CatBoxInterface() {
  const { t } = useTranslation();
  const { cats, loading, error, refetch } = useCats();
  const [nameQuery, setNameQuery] = useState("");
  const [breed, setBreed] = useState("");

  const breeds = useMemo(() => getBreedsFromCats(cats), [cats]);

  const filteredCats = useMemo(() => {
    let list = cats;
    if (nameQuery.trim()) {
      const q = nameQuery.toLowerCase();
      list = list.filter((c) => c.name?.toLowerCase().includes(q));
    }
    if (breed) {
      const b = breed.toLowerCase();
      list = list.filter((c) => c.breed?.toLowerCase() === b);
    }
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [cats, nameQuery, breed]);

  return (
    <div className="min-h-screen flex flex-col">
      <CatBoxHeader
        nameQuery={nameQuery}
        setNameQuery={setNameQuery}
        breed={breed}
        setBreed={setBreed}
        breeds={breeds}
      />
      <main className="flex-1 px-4 py-6">
        {loading ? (
          <SkeletonGrid />
        ) : error ? (
          <div className="flex justify-center">
            <ErrorMessage title={t("catBox.loadError")} message={t("catBox.loadErrorMessage")} onRetry={refetch} />
          </div>
        ) : filteredCats.length === 0 ? (
          <p className="opacity-70 text-center">{t("catBox.noCats")}</p>
        ) : (
          <CatBoxGrid cats={filteredCats} />
        )}
      </main>
    </div>
  );
}
