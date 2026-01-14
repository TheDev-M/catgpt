export default function CatInfoCard({ cat }) {
  return (
    <div className="w-full bg-base-100/90 backdrop-blur shadow-lg rounded-2xl p-6 border border-base-300">
      <h3 className="text-2xl font-bold mb-4">🐾 Cat Profile</h3>

      <div className="mb-4">
        <p className="font-semibold mb-1">Breed</p>
        <p className="opacity-80">{cat.breed}</p>
      </div>

      <div className="mb-4">
        <p className="font-semibold mb-2">Temperaments</p>
        <div className="flex flex-wrap gap-2">
          {cat.temperaments?.map((t, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-amber-200 text-amber-900 rounded-full text-xs font-semibold"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="font-semibold mb-2">Stats</p>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { label: "Hunger", value: cat.stats.hunger },
            { label: "Mood", value: cat.stats.mood },
            { label: "Health", value: cat.stats.health }
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-amber-100 rounded-xl p-3 border border-amber-200"
            >
              <p className="text-[10px] uppercase tracking-wide opacity-70">
                {label}
              </p>
              <p className="text-xl font-bold text-amber-900 mt-1">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
