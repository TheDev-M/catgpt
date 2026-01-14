export default function SkeletonGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto pb-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="card bg-base-200 shadow-lg rounded-2xl overflow-hidden"
        >
          <div className="relative w-full h-72 bg-base-300 rounded-t-2xl p-3">
            <div className="relative w-full h-full overflow-hidden rounded-xl border-[6px] border-base-100 shadow-md">
              <div className="skeleton w-full h-full" />
            </div>
          </div>

          <div className="card-body px-4 py-3 flex flex-col gap-3">
            <div>
              <div className="skeleton h-6 w-3/5 mb-2" />
              <div className="skeleton h-4 w-2/5" />
            </div>
            <div className="flex justify-end">
              <div className="skeleton h-8 w-20 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
