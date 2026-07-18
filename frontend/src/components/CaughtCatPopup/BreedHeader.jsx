import { useTranslation } from "react-i18next";

export default function BreedHeader({ name }) {
  const { t, i18n } = useTranslation();
  if (!name) return null;

  const isEnglish = i18n.language?.startsWith("en");
  const article = isEnglish
    ? (/^[aeiou]/i.test(name) ? t("caughtCat.article_an") : t("caughtCat.article_a"))
    : "";

  return (
    <h2 className="text-2xl font-semibold text-center">
      {t("caughtCat.heading", { article, name })}
    </h2>
  );
}
