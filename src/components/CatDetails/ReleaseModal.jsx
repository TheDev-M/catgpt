export default function ReleaseModal({ open, cat, onConfirm, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-2000 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-base-200 rounded-2xl shadow-xl max-w-sm w-full p-6 z-2100">
        <h3 className="text-xl font-bold text-center mb-3">
          Release {cat?.name}?
        </h3>

        <p className="text-sm text-center opacity-70 mb-6">
          Are you sure you want to release this cat? You won’t be able to get it
          back.
        </p>

        <div className="flex justify-center gap-3">
          <button onClick={onConfirm} className="btn btn-error px-5">
            Yes, release
          </button>
          <button onClick={onClose} className="btn btn-ghost px-5">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
