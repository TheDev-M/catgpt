import ItemGrid from "./ItemGrid.jsx";
import InventoryEmptyState from "./InventoryEmptyState.jsx";
import InventorySkeletonList from "./InventorySkeletonList.jsx";

export default function InventoryDrawer({
  onClose,
  items,
  loading,
  error,
  usingId,
  onUse
}) {
  const filtered = items.filter((i) => (i.availableAmount ?? 0) > 0);
  const hasItems = filtered.length > 0;

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-base-300 flex items-center justify-between">
        <h2 className="font-bold text-lg">Inventory</h2>
        <button
          type="button"
          className="btn btn-ghost btn-xs"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {loading ? (
          <InventorySkeletonList />
        ) : error ? (
          <p className="opacity-70 text-center text-sm">{error}</p>
        ) : !hasItems ? (
          <InventoryEmptyState />
        ) : (
          <ItemGrid items={filtered} usingId={usingId} onUse={onUse} />
        )}
      </div>
    </div>
  );
}
