import { useTranslation } from "react-i18next";
import StatBar from "./StatBar.jsx";

export default function HealthBar({ value }) {
  const { t } = useTranslation();
  return <StatBar label={t("status.health")} value={value} variantClass="progress-error" />;
}
