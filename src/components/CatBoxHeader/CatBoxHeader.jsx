import CatFilter from "./CatFilter.jsx";
import BreedSelect from "./BreedSelect.jsx";

export default function CatBoxHeader({
  nameQuery,
  setNameQuery,
  breed,
  setBreed,
  breeds
}) {
  return (
    <header className="sticky top-0 z-10 bg-base-100/80 backdrop-blur border-b border-base-200">
      <div className="max-w-6xl mx-auto flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <CatFilter value={nameQuery} onChange={setNameQuery} />
        <BreedSelect breeds={breeds} value={breed} onChange={setBreed} />
      </div>
    </header>
  );
}
