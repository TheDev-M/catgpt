export default function CatProfileCard({ cat }) {
  if (!cat) return null;

  return (
    <div className="flex flex-col items-center text-center bg-base-100 rounded-3xl shadow-xl border border-base-300 p-6">
      <img
        src={cat.image}
        alt={cat.name}
        draggable="false"
        loading="lazy"
        className="max-w-sm w-full h-auto rounded-2xl shadow-md object-contain select-none"
      />

      <h1 className="text-4xl font-extrabold mt-4">{cat.name}</h1>
    </div>
  );
}
