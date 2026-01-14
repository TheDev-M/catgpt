export default function StatBar({
  label,
  value = 0,
  className = "",
  variantClass = "progress-primary"
}) {
  const safeValue = Math.max(0, Math.min(10, Number(value) || 0));

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold">{label}</span>
        <span className="opacity-70">{safeValue}/10</span>
      </div>

      <progress
        className={`progress ${variantClass} w-full h-2`}
        value={safeValue}
        max="10"
      />
    </div>
  );
}
