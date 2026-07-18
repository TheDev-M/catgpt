import { useTranslation } from "react-i18next";

export default function BreedSelect({ breeds = [], value, onChange }) {
  const { t } = useTranslation();
  return (
    <select
      id="catbox-breed-select"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      aria-label={t("catBox.selectBreed")}
      className="select select-bordered w-full md:w-72"
    >
      <option value="">{t("catBox.allBreeds")}</option>
      {breeds.map((b) => (
        <option key={b} value={b}>{b}</option>
      ))}
    </select>
  );
}
