import { useState } from "react";
import { useTranslation } from "react-i18next";
import { createCat } from "@/services/catApi.js";

const NICKNAME_PATTERN = /^[A-Za-z][A-Za-z0-9 ]*$/;

function validateNickname(name, hasDuplicateName) {
  const trimmed = name.trim();
  if (!trimmed) return { key: "validation.nicknameRequired" };
  if (trimmed.length < 3) return { key: "validation.nicknameTooShort" };
  if (trimmed.length > 16) return { key: "validation.nicknameTooLong" };
  if (!NICKNAME_PATTERN.test(trimmed)) return { key: "validation.nicknameInvalid" };
  if (hasDuplicateName(trimmed)) return { key: "validation.nicknameDuplicate", options: { name: trimmed } };
  return null;
}

export function useCaughtCatForm(cat, hasDuplicateName, onSuccess) {
  const { t } = useTranslation();
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = validateNickname(nickname, hasDuplicateName);
    if (result) {
      setError(t(result.key, result.options));
      return;
    }

    try {
      await createCat({
        name: nickname.trim(),
        breed: cat.name,
        temperaments: cat.temperaments,
        sourceMetrics: {
          energyLevel: cat.energy_level,
          grooming: cat.grooming,
          healthIssues: cat.health_issues
        },
        image: cat.image || null
      });
      onSuccess();
    } catch (err) {
      setError(err.message || t("validation.nicknameSaveError"));
    }
  };

  return {
    nickname,
    setNickname: (val) => { setNickname(val); setError(""); },
    error,
    handleSubmit
  };
}
