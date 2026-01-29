import { useState } from "react";
import { validateCatName } from "@/utils/validation.js";
import { renameCatById } from "@/services/catApi.js";

/**
 * Custom hook to manage cat renaming functionality
 * Handles form state, validation, and API calls for renaming a cat
 *
 * @param {Object} cat - The cat object to rename
 * @param {Function} hasDuplicateName - Function to check for duplicate names
 * @param {Function} onSuccess - Callback after successful rename
 * @returns {Object} Rename form state and handlers
 */
export function useRenameForm(cat, hasDuplicateName, onSuccess) {
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState("");
  const [nameHint, setNameHint] = useState("");
  const [nameError, setNameError] = useState("");

  const startRenaming = () => {
    setRenaming(true);
    setNewName(cat?.name || "");
  };

  const cancelRenaming = () => {
    setRenaming(false);
    setNewName("");
    setNameHint("");
    setNameError("");
  };

  const updateName = (value) => {
    setNewName(value);
    if (nameHint) setNameHint("");
    if (nameError) setNameError("");
  };

  const handleRename = async (e) => {
    e.preventDefault();
    if (!cat) return;

    setNameError("");

    const validationMessage = validateCatName(newName, cat, hasDuplicateName);

    if (validationMessage) {
      setNameHint(validationMessage);
      return;
    }

    try {
      await renameCatById(cat.id, newName.trim());
      await onSuccess();

      cancelRenaming();
    } catch (err) {
      setNameError(
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
    nameHint,
    nameError,
    startRenaming,
    cancelRenaming,
    updateName,
    handleRename,
  };
}
