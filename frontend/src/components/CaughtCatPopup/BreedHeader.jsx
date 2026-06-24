export default function BreedHeader({ name }) {
  if (!name) return null;
  const article = /^[aeiou]/i.test(name) ? "an" : "a";
  return (
    <h2 className="text-2xl font-semibold text-center">You caught {article} {name}!</h2>
  );
}
