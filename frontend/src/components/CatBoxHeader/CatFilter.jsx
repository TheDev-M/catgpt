import { useTranslation } from "react-i18next";

export default function CatFilter({ value, onChange }) {
  const { t } = useTranslation();
  return (
    <input
      id="catbox-search-input"
      type="text"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={t("catBox.searchPlaceholder")}
      className="input input-bordered w-full md:w-72"
      aria-label={t("catBox.searchLabel")}
    />
  );
}
