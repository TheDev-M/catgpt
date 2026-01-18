import { useRef, useState } from "react";

export default function RenameSection({
  newName,
  setNewName,
  error,
  onSubmit,
  onCancel
}) {
  const inputRef = useRef(null);
  const [hint, setHint] = useState("");

  function handleInput(e) {
    const el = inputRef.current;

    setNewName(e.target.value);

    if (el.validity.valueMissing) {
      setHint("Name is required.");
    } else if (el.validity.patternMismatch) {
      setHint(
        "Only letters, numbers, and spaces allowed. Must start with a letter."
      );
    } else if (el.validity.tooShort) {
      setHint(`Name must be at least ${el.minLength} characters.`);
    } else if (el.validity.tooLong) {
      setHint(`Name must be less than ${el.maxLength} characters.`);
    } else {
      setHint("");
    }
  }

  return (
    <form
      id="cat-rename-form"
      onSubmit={onSubmit}
      className="
        fixed bottom-20 left-1/2 -translate-x-1/2
        z-[60]
        w-full max-w-md
        bg-base-200/95 backdrop-blur
        rounded-2xl shadow-lg
        px-5 py-4 flex flex-col gap-3
      "
    >
      <div className="form-control w-full">
        <label className="label px-1">
          <span className="label-text font-semibold">Rename your cat</span>
        </label>

        <input
          id="cat-rename-input"
          ref={inputRef}
          type="text"
          required
          pattern="[A-Za-z][A-Za-z0-9 ]*"
          minLength={3}
          maxLength={16}
          placeholder="New cat name"
          value={newName}
          onChange={handleInput}
          className={`input validator input-bordered w-full ${
            error ? "input-error" : ""
          }`}
        />

        {hint && <p id="cat-rename-hint" className="text-xs mt-1 text-warning">{hint}</p>}
      </div>

      {error && <p id="cat-rename-error" className="text-error text-xs text-center -mt-1">{error}</p>}

      <div className="flex justify-end gap-2">
        <button
          id="cat-rename-cancel"
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button 
          id="cat-rename-submit"
          type="submit" 
          className="btn btn-primary btn-sm"
        >
          Done
        </button>
      </div>
    </form>
  );
}
