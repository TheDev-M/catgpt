import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CatDetailsButton({ id }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <button
      id={`cat-view-button-${id}`}
      type="button"
      onClick={() => navigate(`/catbox/${id}`)}
      className="btn btn-primary btn-sm rounded-full px-6 shadow-md hover:shadow-lg transition-transform hover:-translate-y-px"
      title={t("catBox.viewDetails")}
      data-cat-id={id}
    >
      {t("catBox.view")}
    </button>
  );
}
