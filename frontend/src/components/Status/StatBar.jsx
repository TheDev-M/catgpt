export default function StatBar({
  label,
  value = 0,
  className = "",
  variantClass = "progress-primary"
}) {
  const safeValue = Math.max(0, Math.min(10, Number(value) || 0));

  const textClass =
    variantClass === "progress-success" ? "text-success" :
    variantClass === "progress-warning" ? "text-warning" :
    variantClass === "progress-error"   ? "text-error"   : "text-primary";

  return (
    <div className={`space-y-0.5 sm:space-y-1 ${className}`}>
      {/* Mobile */}
      <div className="sm:hidden">
        <div className={`flex justify-between text-[9px] font-semibold mb-0.5 ${textClass}`}>
          <span>{label}</span>
          <span>{safeValue}/10</span>
        </div>
        <progress className={`progress ${variantClass} w-full h-1`} value={safeValue} max="10" />
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
