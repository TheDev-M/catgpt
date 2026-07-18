import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CatBoxButton() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <button
      id="catbox-button"
      type="button"
      aria-label={t("nav.catBox")}
      title={t("nav.catBox")}
      onClick={() => navigate("/catbox")}
      className="btn btn-primary rounded-full w-12 h-12 shadow-lg transition-transform hover:scale-110 p-0"
    >
      <img
        src="/imgs/catbox.png"
        alt={t("nav.catBox")}
        draggable="false"
        className="w-full h-full object-contain select-none scale-120 -translate-y-1"
      />
    </button>
  );
}
