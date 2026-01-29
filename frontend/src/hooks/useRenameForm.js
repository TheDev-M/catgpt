import { useState } from "react";
import { validateCatName } from "@/utils/validation.js";
import { renameCatById } from "@/services/catApi.js";

export function useRenameForm(cat, hasDuplicateName, onSuccess) {
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState("");
  const [hint, setHint] = useState("");
  const [error, setError] = useState("");

  const startRenaming = () => {
    setRenaming(true);
    setNewName(cat?.name || "");
    setHint("");
    setError("");
  };

  const cancelRenaming = () => {
    setRenaming(false);
    setNewName("");
    setHint("");
    setError("");
  };

  const updateName = (value) => {
    setNewName(value);
    setHint("");
    setError("");
  };

  const handleRename = async (e) => {
    e.preventDefault();
    if (!cat) return;

    const validationMessage = validateCatName(newName, cat, hasDuplicateName);
    if (validationMessage) {
      setHint(validationMessage);
      return;
    }

    try {
      await renameCatById(cat.id, newName.trim());
      await onSuccess();
      cancelRenaming();
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

  return {
    renaming,
    newName,
    hint,
    error,
    startRenaming,
    cancelRenaming,
    updateName,
    handleRename
  };
}
