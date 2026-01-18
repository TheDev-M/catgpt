export default function ActionButtons({
  isSelected,
  isDefaultCat,
  onRename,
  onRelease,
  onBack,
  onSelect
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-base-200/90 backdrop-blur border-t border-base-300 shadow-lg">
      <div className="max-w-3xl mx-auto flex justify-around items-center py-3 px-4 gap-2">
        <button
          id="cat-select-button"
          className="btn btn-success rounded-full px-5"
          onClick={onSelect}
          disabled={isSelected}
        >
          Select
        </button>

        <button
          id="cat-rename-button"
          className="btn btn-info rounded-full px-5"
          onClick={onRename}
          disabled={isDefaultCat}
        >
          Rename
        </button>

        <button
          id="cat-release-button"
          className="btn btn-error rounded-full px-5"
          onClick={onRelease}
          disabled={isDefaultCat}
        >
          Release
        </button>

        <button 
          id="cat-back-button"
          className="btn btn-outline rounded-full px-5" 
          onClick={onBack}
        >
          Back
        </button>
      </div>
    </div>
  );
}
