import CatCard from "./CatCard.jsx";

export default function CatBoxGrid({ cats = [] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto pb-6">
      {cats.map((c) => (
        <CatCard key={c.id} cat={c} />
      ))}
    </div>
  );
}
