import { useState } from "react";
import { useTranslation } from "react-i18next";

export function useSignupForm(register, onSuccess) {
  const { t } = useTranslation();
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
      setError(t("validation.passwordMismatch"));
      return;
    }

    setLoading(true);

    try {
      await register(username.trim(), password, description.trim() || null);
      onSuccess();
    } catch {
      setError(t("validation.signupFailed"));
      setLoading(false);
    }
  };

  return { username, setUsername, description, setDescription, password, setPassword, confirm, setConfirm, error, loading, handleSubmit };
}
