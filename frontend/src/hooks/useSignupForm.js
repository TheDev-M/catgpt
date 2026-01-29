import { useState } from "react";

/**
 * Validates password confirmation match
 * 
 * @param {string} password - The password
 * @param {string} confirm - The confirmation password
 * @returns {string} Error message if invalid, empty string if valid
 */
function validatePasswordMatch(password, confirm) {
  if (password !== confirm) {
    return "Passwords do not match.";
  }
  return "";
}

/**
 * Custom hook to manage signup form state and submission
 * 
 * @param {Function} register - Register function from auth context
 * @param {Function} onSuccess - Callback on successful registration
 * @returns {Object} Signup form state and handlers
 */
export function useSignupForm(register, onSuccess) {
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validatePasswordMatch(password, confirm);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      await register(username.trim(), password, description.trim() || null);
      onSuccess();
    } catch {
      setError("Failed to register. Try a different username?");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    username,
    setUsername,
    description,
    setDescription,
    password,
    setPassword,
    confirm,
    setConfirm,
    error,
    isLoading,
    handleSubmit,
  };
}
