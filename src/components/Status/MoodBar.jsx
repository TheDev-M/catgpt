import StatBar from "./StatBar.jsx";

export default function MoodBar({ value }) {
  return <StatBar label="Mood" value={value} variantClass="progress-warning" />;
}
