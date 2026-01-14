export default function BreedHeader({ name }) {
  if (!name) return null;
  return (
    <h2 className="text-2xl font-semibold text-center">You caught a {name}!</h2>
  );
}
