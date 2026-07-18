import { useTranslation } from "react-i18next";
import StatBar from "./StatBar.jsx";

export default function MoodBar({ value }) {
  const { t } = useTranslation();
  return <StatBar label={t("status.mood")} value={value} variantClass="progress-warning" />;
}
