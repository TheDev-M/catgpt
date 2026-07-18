import { useTranslation } from "react-i18next";

export default function ReleaseModal({ open, cat, onConfirm, onClose }) {
  const { t } = useTranslation();
  if (!open) return null;

  return (
    <div id="cat-release-modal" className="fixed inset-0 z-2000 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-base-200 rounded-2xl shadow-xl max-w-sm w-full p-6 z-2100">
        <h3 id="cat-release-modal-title" className="text-xl font-bold text-center mb-3">
          {t("catDetails.releaseTitle", { name: cat?.name })}
        </h3>
        <p id="cat-release-modal-message" className="text-sm text-center opacity-70 mb-6">
          {t("catDetails.releaseConfirm")}
        </p>
        <div className="flex justify-center gap-3">
          <button id="cat-release-confirm" onClick={onConfirm} className="btn btn-error px-5">
            {t("catDetails.releaseYes")}
          </button>
          <button id="cat-release-cancel" onClick={onClose} className="btn btn-ghost px-5">
            {t("common.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}
