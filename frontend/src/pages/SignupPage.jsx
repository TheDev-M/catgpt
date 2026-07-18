import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth.js";
import { useSignupForm } from "@/hooks/useSignupForm.js";
import LayoutBackground from "@/components/Layouts/LayoutBackground.jsx";
import LanguageSwitcher from "@/components/LanguageSwitcher/LanguageSwitcher.jsx";
import { API_BASE_URL } from "@/services/apiClient.js";

export default function SignupPage() {
  const { t } = useTranslation();
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const form = useSignupForm(register, () => navigate("/", { replace: true }));

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
  };

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <LayoutBackground variant="neutral">
      <div className="min-h-dvh flex items-center justify-center px-4">
        <div className="card bg-base-100/95 backdrop-blur shadow-xl w-full max-w-md">
          <div className="card-body py-8 px-6">
            <div className="flex justify-end mb-2"><LanguageSwitcher /></div>
            <h1 id="signup-title" className="card-title text-3xl mb-1 text-center">{t("signup.title")}</h1>
            <p id="signup-subtitle" className="text-sm opacity-70 mb-6 text-center">{t("signup.subtitle")}</p>

            <form id="signup-form" onSubmit={form.handleSubmit} className="space-y-6">
              <div className="form-control w-full">
                <label className="label"><span className="label-text">{t("signup.username")}</span></label>
                <input id="signup-username" type="text" className="input input-bordered w-full"
                  value={form.username} onChange={(e) => form.setUsername(e.target.value)}
                  required minLength={3} maxLength={24} autoComplete="username" disabled={form.loading} />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">{t("signup.aboutLabel")} <span className="opacity-60">{t("signup.aboutOptional")}</span></span>
                </label>
                <textarea id="signup-description" className="textarea textarea-bordered rounded-md w-full resize-none"
                  rows={3} value={form.description} onChange={(e) => form.setDescription(e.target.value)}
                  placeholder={t("signup.aboutPlaceholder")} maxLength={300} disabled={form.loading} />
                <span className="label-text-alt opacity-60 text-xs mt-1">{t("signup.aboutHint")}</span>
              </div>

              <div className="form-control w-full">
                <label className="label"><span className="label-text">{t("signup.password")}</span></label>
                <input id="signup-password" type="password" className="input input-bordered w-full"
                  value={form.password} onChange={(e) => form.setPassword(e.target.value)}
                  required minLength={6} autoComplete="new-password" disabled={form.loading} />
              </div>

              <div className="form-control w-full">
                <label className="label"><span className="label-text">{t("signup.confirmPassword")}</span></label>
                <input id="signup-confirm-password" type="password" className="input input-bordered w-full"
                  value={form.confirm} onChange={(e) => form.setConfirm(e.target.value)}
                  required minLength={6} autoComplete="new-password" disabled={form.loading} />
              </div>

              {form.error && <p id="signup-error" className="text-error text-sm text-center">{form.error}</p>}

              <button id="signup-submit" type="submit" className="btn btn-primary w-full mt-2" disabled={form.loading}>
                {form.loading ? (<><span className="loading loading-spinner loading-sm" /><span className="ml-2">{t("signup.submitting")}</span></>) : t("signup.submit")}
              </button>
            </form>

            <div className="divider text-xs opacity-60">{t("common.or")}</div>

            <button id="signup-google" type="button" onClick={handleGoogleLogin} className="btn btn-outline w-full">
              {t("signup.google")}
            </button>

            <div className="mt-8 pt-4 border-t text-center text-sm">
              <span className="opacity-70">{t("signup.hasAccount")} </span>
              <Link id="signup-login-link" to="/login" className="link link-primary">{t("signup.loginLink")}</Link>
            </div>
          </div>
        </div>
      </div>
    </LayoutBackground>
  );
}
