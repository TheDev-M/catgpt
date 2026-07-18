import { useTranslation } from "react-i18next";
import StatBar from "./StatBar.jsx";

export default function HungerBar({ value }) {
  const { t } = useTranslation();
  return <StatBar label={t("status.hunger")} value={value} variantClass="progress-success" />;
}
