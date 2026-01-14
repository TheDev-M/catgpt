export default function InventorySkeletonList() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="card bg-base-200 shadow rounded-2xl p-4 space-y-2"
        >
          <div className="skeleton h-5 w-1/2" />
          <div className="skeleton h-4 w-1/3" />
          <div className="skeleton h-16 w-16 rounded-xl" />
          <div className="skeleton h-4 w-1/3" />
        </div>
      ))}
    </div>
  );
}
