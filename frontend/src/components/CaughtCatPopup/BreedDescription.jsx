export default function BreedDescription({ description, error }) {
  return (
    <>
      {description && <p className="text-center">{description}</p>}
      {error && (
        <p className="text-error text-sm text-center">
          Failed to load breed info. You can still save it.
        </p>
      )}
    </>
  );
}
