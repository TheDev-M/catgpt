import { useState } from "react";

export function useSignupForm(register, onSuccess) {
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register(username.trim(), password, description.trim() || null);
      onSuccess();
    } catch {
      setError("Failed to register. Try a different username?");
      setLoading(false);
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
    loading,
    handleSubmit
  };
}
