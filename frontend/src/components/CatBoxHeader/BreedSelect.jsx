export default function BreedSelect({ breeds = [], value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      aria-label="Select cat breed"
      className="select select-bordered w-full md:w-72"
    >
      <option value="">All Breeds</option>
      {breeds.map((b) => (
        <option key={b} value={b}>
          {b}
        </option>
      ))}
    </select>
  );
}
