export default function BreedImage({ src, alt }) {
  if (!src) return null;
  return (
    <div className="flex justify-center">
      <img src={src} alt={alt} className="rounded-lg shadow-md max-h-64" />
    </div>
  );
}
