export default function LayoutBackground({ children, variant = "default" }) {
  const variants = {
    default: "from-base-300 via-base-200/95 to-base-100",
    warm: "from-primary/40 via-base-200/95 to-base-100",
    cool: "from-secondary/40 via-base-200/95 to-base-100",
    neutral: "from-neutral/40 via-base-200/95 to-base-100"
  };

  return (
    <div
      className={`
        relative min-h-screen text-base-content
        bg-linear-to-br ${variants[variant]}
        overflow-hidden
      `}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}
