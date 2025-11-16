import StatBar from "./StatBar.jsx";

export default function HungerBar({ value }) {
  return (
    <StatBar label="Hunger" value={value} variantClass="progress-success" />
  );
}
