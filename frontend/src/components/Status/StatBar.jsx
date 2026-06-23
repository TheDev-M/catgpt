export default function StatBar({
  label,
  value = 0,
  className = "",
  variantClass = "progress-primary"
}) {
  const safeValue = Math.max(0, Math.min(10, Number(value) || 0));

  const fillClass =
    variantClass === "progress-success" ? "bg-success" :
    variantClass === "progress-warning" ? "bg-warning" :
    variantClass === "progress-error"   ? "bg-error"   : "bg-primary";

  const textClass =
    variantClass === "progress-success" ? "text-success" :
    variantClass === "progress-warning" ? "text-warning" :
    variantClass === "progress-error"   ? "text-error"   : "text-primary";

  return (
    <div className={`space-y-0.5 sm:space-y-1 ${className}`}>
      {/* Mobile */}
      <div className="sm:hidden relative h-3">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-base-300 overflow-hidden">
          <div
            className={`h-full rounded-full ${fillClass}`}
            style={{ width: `${(safeValue / 10) * 100}%` }}
          />
        </div>
        <span className={`absolute inset-0 flex items-center px-1.5 text-[9px] font-bold leading-none z-10 ${textClass}`}>
          {label}: {safeValue}/10
        </span>
      </div>

      {/* Desktop */}
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
