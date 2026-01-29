import { useState, useEffect, useRef } from "react";
import { validateCatName } from "@/utils/validation.js";
import { renameCatById } from "@/services/catApi.js";

export default function RenameSection({
  cat,
  hasDuplicateName,
  onClose,
  refetch
}) {
  const [newName, setNewName] = useState(cat?.name || "");
  const [hint, setHint] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    setNewName(cat?.name || "");
    setHint("");
    setError("");
    inputRef.current?.focus();
  }, [cat]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationMessage = validateCatName(newName, cat, (name) =>
      hasDuplicateName(name, cat.id)
    );

    if (validationMessage) {
      setHint(validationMessage);
      return;
    }

    try {
      await renameCatById(cat.id, newName.trim());
      await refetch();
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.response?.data?.detail ||
          err?.message ||
          "Failed to rename. Please try again."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-60 w-full max-w-md bg-base-200/95 backdrop-blur rounded-2xl shadow-lg px-5 py-4 flex flex-col gap-3"
    >
      <label className="label px-1">
        <span className="label-text font-semibold">Rename your cat</span>
      </label>

      <input
        ref={inputRef}
        type="text"
        required
        pattern="[A-Za-z][A-Za-z0-9 ]*"
        minLength={3}
        maxLength={16}
        placeholder="New cat name"
        value={newName}
        onChange={(e) => {
          setNewName(e.target.value);
          setHint("");
          setError("");
        }}
        className={`input input-bordered w-full ${error ? "input-error" : ""}`}
      />

      {hint && <p className="text-xs mt-1 text-warning">{hint}</p>}
      {error && <p className="text-error text-xs text-center -mt-1">{error}</p>}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={onClose}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary btn-sm">
          Done
        </button>
      </div>
    </form>
  );
}
