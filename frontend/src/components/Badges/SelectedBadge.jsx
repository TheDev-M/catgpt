import { useTranslation } from "react-i18next";

export default function SelectedBadge() {
  const { t } = useTranslation();
  return (
    <div className="absolute top-2 right-2 z-20">
      <span className="badge badge-primary badge-sm shadow">{t("catBox.selected")}</span>
    </div>
  );
}
