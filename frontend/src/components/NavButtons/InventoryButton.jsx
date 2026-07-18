import { useTranslation } from "react-i18next";

export default function InventoryButton({ open, onToggle }) {
  const { t } = useTranslation();
  return (
    <button
      id="inventory-button"
      type="button"
      aria-label={t("nav.inventory")}
      title={open ? t("nav.closeInventory") : t("nav.openInventory")}
      onClick={onToggle}
      className="btn btn-primary rounded-full w-12 h-12 shadow-lg transition-transform hover:scale-110 p-0"
    >
      <img
        src="/imgs/inventory.png"
        alt={t("nav.inventory")}
        draggable="false"
        className="w-full h-full object-contain p-1"
      />
    </button>
  );
}
