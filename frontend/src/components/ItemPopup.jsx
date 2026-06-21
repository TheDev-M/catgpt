import { useEffect } from "react";

export default function ItemPopup({ icon, name, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2000);
    return () => clearTimeout(t);
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
        <span className="font-semibold text-sm">+1 {name}</span>
      </div>
    </div>
  );
}
