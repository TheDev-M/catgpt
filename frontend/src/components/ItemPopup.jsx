import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function ItemPopup({ icon, name, onClose }) {
  const { t } = useTranslation();
  useEffect(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast toast-bottom toast-center z-2000">
      <div className="alert bg-base-100 shadow-lg border border-base-300 flex items-center gap-3">
        <img
          src={icon}
          alt={name}
          className="w-8 h-8 object-contain select-none"
          draggable="false"
        />
        <span className="font-semibold text-sm">{t("inventory.itemGained", { name })}</span>
      </div>
    </div>
  );
}
