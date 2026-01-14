export default function CatFilter({ value, onChange }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder="Search by name…"
      className="input input-bordered w-full md:w-72"
      aria-label="Filter cats by name"
    />
  );
}
