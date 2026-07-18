import { useTranslation } from "react-i18next";

export default function InventoryEmptyState() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center text-sm">
      <p className="opacity-70 mb-2">{t("inventory.empty")}</p>
      <p className="opacity-50">{t("inventory.emptyHint")}</p>
    </div>
  );
}
