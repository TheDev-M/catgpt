export default function LoadingSkeleton() {
  return (
    <div className="fixed inset-0 grid place-items-center z-50">
      <div className="modal-box">
        <div className="skeleton h-6 w-40 mb-3" />
        <div className="skeleton h-44 w-64" />
      </div>
    </div>
  );
}
