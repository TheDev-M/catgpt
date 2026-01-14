import StatBar from "./StatBar.jsx";

export default function HealthBar({ value }) {
  return <StatBar label="Health" value={value} variantClass="progress-error" />;
}
