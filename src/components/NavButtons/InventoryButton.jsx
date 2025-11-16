export default function InventoryButton({ open, onToggle }) {
  return (
    <button
      type="button"
      aria-label="Toggle Inventory"
      title={open ? "Close Inventory" : "Open Inventory"}
      onClick={onToggle}
      className="btn btn-primary rounded-full w-12 h-12 shadow-lg transition-transform hover:scale-110 p-0"
    >
      <img
        src="/imgs/inventory.png"
        alt="Inventory"
        draggable="false"
        className="w-full h-full object-contain p-1"
      />
    </button>
  );
}
