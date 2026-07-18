import { useTranslation } from "react-i18next";

export default function BreedDescription({ description, error }) {
  const { t } = useTranslation();
  return (
    <>
      {description && <p className="text-center">{description}</p>}
      {error && (
        <p className="text-error text-sm text-center">{t("caughtCat.descError")}</p>
      )}
    </>
  );
}
