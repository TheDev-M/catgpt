import { useState } from "react";
import { validateCatName } from "@/utils/validation.js";
import { renameCatById } from "@/services/catApi.js";

export function useRenameForm(cat, hasDuplicateName, onSuccess) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const open = () => {
    setIsOpen(true);
    setName(cat?.name || "");
    setError("");
  };

  const close = () => {
    setIsOpen(false);
    setName("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cat) return;

    const validationError = validateCatName(name, cat, hasDuplicateName);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await renameCatById(cat.id, name.trim());
      await onSuccess();
      close();
    } catch (err) {
      setError(err.message || "Failed to rename. Please try again.");
    }
  };

  return {
    isOpen,
    name,
    setName: (val) => {
      setName(val);
      setError("");
    },
    error,
    open,
    close,
    handleSubmit,
  };
}
