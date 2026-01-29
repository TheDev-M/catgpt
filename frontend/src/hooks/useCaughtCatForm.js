import { useState } from "react";
import { createCat } from "@/services/catApi.js";

/**
 * Validates a cat nickname according to the following rules:
 * - Must not be empty
 * - Must start with a letter
 * - Can only contain letters, numbers, and spaces
 * - Must be between 3 and 16 characters
 * - Must be unique
 *
 * @param {string} rawName - The nickname to validate
 * @param {Function} hasDuplicateName - Function to check if name already exists
 * @returns {string} Error message if invalid, empty string if valid
 */
function validateNickname(rawName, hasDuplicateName) {
  const trimmed = rawName.trim();

  if (!trimmed) return "Nickname is required.";
  if (trimmed.length < 3) return "Must be at least 3 characters.";
  if (trimmed.length > 16) return "Must be less than 16 characters.";
  if (!/^[A-Za-z][A-Za-z0-9 ]*$/.test(trimmed)) {
    return "Only letters, numbers and spaces allowed. Must start with a letter.";
  }
  if (hasDuplicateName(trimmed)) {
    return `You already have a cat named "${trimmed}"`;
  }

  return "";
}

/**
 * Custom hook to manage caught cat popup form
 * Handles nickname input, validation, and cat creation
 *
 * @param {Object} cat - The cat breed data
 * @param {Function} hasDuplicateName - Function to check for duplicate names
 * @param {Function} onSuccess - Callback after successful cat creation
 * @returns {Object} Form state and handlers
 */
export function useCaughtCatForm(cat, hasDuplicateName, onSuccess) {
  const [nickname, setNickname] = useState("");
  const [hint, setHint] = useState("");
  const [error, setError] = useState("");

  const updateNickname = (value) => {
    setNickname(value);
    if (hint) setHint("");
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationMessage = validateNickname(nickname, hasDuplicateName);
    if (validationMessage) {
      setHint(validationMessage);
      return;
    }

    const trimmedName = nickname.trim();

    try {
      await createCat({
        name: trimmedName,
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
      const serverMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to save cat. Please try again.";

      setError(serverMsg);
    }
  };

  return {
    nickname,
    updateNickname,
    hint,
    error,
    handleSubmit,
  };
}
