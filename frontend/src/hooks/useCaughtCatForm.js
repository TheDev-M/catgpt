import { useState } from "react";
import { createCat } from "@/services/catApi.js";

const NICKNAME_PATTERN = /^[A-Za-z][A-Za-z0-9 ]*$/;

function validateNickname(name, hasDuplicateName) {
  const trimmed = name.trim();

  if (!trimmed) return "Nickname is required.";
  if (trimmed.length < 3) return "Must be at least 3 characters.";
  if (trimmed.length > 16) return "Must be less than 16 characters.";
  if (!NICKNAME_PATTERN.test(trimmed)) {
    return "Only letters, numbers and spaces allowed. Must start with a letter.";
  }
  if (hasDuplicateName(trimmed)) {
    return `You already have a cat named "${trimmed}"`;
  }

  return "";
}

export function useCaughtCatForm(cat, hasDuplicateName, onSuccess) {
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateNickname(nickname, hasDuplicateName);
    if (validationError) {
      setError(validationError);
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
          healthIssues: cat.health_issues,
        },
        image: cat.image || null,
      });
      onSuccess();
    } catch (err) {
      setError(err.message || "Failed to save cat. Please try again.");
    }
  };

  return {
    nickname,
    setNickname: (val) => {
      setNickname(val);
      setError("");
    },
    error,
    handleSubmit,
  };
}
