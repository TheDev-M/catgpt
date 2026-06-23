export default function StatBar({
  label,
  value = 0,
  className = "",
  variantClass = "progress-primary"
}) {
  const safeValue = Math.max(0, Math.min(10, Number(value) || 0));

  return (
    <div className={`space-y-0.5 sm:space-y-1 ${className}`}>
      <div className="hidden sm:flex items-center justify-between text-xs">
        <span className="font-semibold">{label}</span>
        <span className="opacity-70">{safeValue}/10</span>
      </div>

      <progress
        className={`progress ${variantClass} w-full h-1.5 sm:h-2`}
        title={`${label}: ${safeValue}/10`}
        value={safeValue}
        max="10"
      />
    </div>
  );
}
