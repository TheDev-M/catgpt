export default function InventoryEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center text-sm">
      <p className="opacity-70 mb-2">No items available.</p>
      <p className="opacity-50">Earn or buy items to see them here.</p>
    </div>
  );
}
