export default function StatBar({
  label,
  value = 0,
  className = "",
  variantClass = "progress-primary"
}) {
  const safeValue = Math.max(0, Math.min(10, Number(value) || 0));
  const fillClass = variantClass.replace("progress-", "bg-");

  return (
    <div className={`space-y-0.5 sm:space-y-1 ${className}`}>
      {/* Mobile: custom bar with text overlaid on it */}
      <div className="sm:hidden relative h-4 w-full rounded-full bg-base-300 overflow-hidden">
        <div
          className={`h-full rounded-full ${fillClass}`}
          style={{ width: `${(safeValue / 10) * 100}%` }}
        />
        <span className="absolute inset-0 flex items-center px-2 text-[9px] font-bold text-base-content leading-none">
          {label}: {safeValue}/10
        </span>
      </div>

      {/* Desktop: label row + native progress element */}
      <div className="hidden sm:flex items-center justify-between text-xs">
        <span className="font-semibold">{label}</span>
        <span className="opacity-70">{safeValue}/10</span>
      </div>
      <progress
        className={`hidden sm:block progress ${variantClass} w-full h-2`}
        value={safeValue}
        max="10"
      />
    </div>
  );
}
