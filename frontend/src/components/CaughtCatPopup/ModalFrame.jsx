export default function ModalFrame({ onClose, children }) {
  return (
    <div id="caught-cat-modal" className="fixed inset-0 flex justify-center items-center z-50">
      <div className="modal modal-open">
        <div id="caught-cat-modal-content" className="modal-box space-y-4 bg-base-200 text-base-content">
          {children}
        </div>
        <div className="modal-backdrop" onClick={onClose} />
      </div>
    </div>
  );
}
