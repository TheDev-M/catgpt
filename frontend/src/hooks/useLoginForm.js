import { useState } from "react";

/**
 * Custom hook to manage login form state and submission
 * 
 * @param {Function} login - Login function from auth context
 * @param {Function} onSuccess - Callback on successful login
 * @returns {Object} Login form state and handlers
 */
export function useLoginForm(login, onSuccess) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(username.trim(), password);
      onSuccess();
    } catch {
      setError("Invalid username or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    error,
    isLoading,
    handleSubmit,
  };
}
