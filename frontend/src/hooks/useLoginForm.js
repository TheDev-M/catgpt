import { useState } from "react";
import { useTranslation } from "react-i18next";

export function useLoginForm(login, onSuccess) {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username.trim(), password);
      onSuccess();
    } catch {
      setError(t("validation.loginFailed"));
      setLoading(false);
    }
  };

  return { username, setUsername, password, setPassword, error, loading, handleSubmit };
}
