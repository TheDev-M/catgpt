export default function ErrorMessage({
  title = "Something went wrong",
  message,
  onRetry
}) {
  return (
    <div className="w-full max-w-md p-4 rounded-xl border border-error/30 bg-error/10 text-error text-center">
      <h3 className="font-semibold mb-1">{title}</h3>
      {message && <p className="text-sm opacity-80 mb-3">{message}</p>}
      {onRetry && (
        <button className="btn btn-sm btn-error" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
