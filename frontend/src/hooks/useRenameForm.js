import { useState } from "react";
import { useTranslation } from "react-i18next";
import { validateCatName } from "@/utils/validation.js";
import { renameCatById } from "@/services/catApi.js";

export function useRenameForm(cat, hasDuplicateName, onSuccess) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const open = () => { setIsOpen(true); setName(cat?.name || ""); setError(""); };
  const close = () => { setIsOpen(false); setName(""); setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cat) return;

    const result = validateCatName(name, cat, hasDuplicateName);
    if (result) {
      setError(t(result.key, result.options));
      return;
    }

    try {
      await renameCatById(cat.id, name.trim());
      await onSuccess();
      close();
    } catch (err) {
      setError(err.message || t("catDetails.renameError"));
    }
  };

  return {
    isOpen, name,
    setName: (val) => { setName(val); setError(""); },
    error, open, close, handleSubmit
  };
}
