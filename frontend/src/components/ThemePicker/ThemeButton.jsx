export default function ThemeButton({ themeName, active, onSelect }) {
  return (
    <button
      type="button"
      title={themeName}
      onClick={() => onSelect(themeName)}
      className={[
        "btn btn-ghost p-0 w-8 h-8 rounded-full border-2",
        active ? "border-primary" : "border-transparent"
      ].join(" ")}
    >
      <div
        data-theme={themeName}
        className="w-full h-full rounded-full bg-primary"
      />
    </button>
  );
}
