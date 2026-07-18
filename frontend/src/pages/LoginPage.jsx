import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth.js";
import { useLoginForm } from "@/hooks/useLoginForm.js";
import LayoutBackground from "@/components/Layouts/LayoutBackground.jsx";
import LanguageSwitcher from "@/components/LanguageSwitcher/LanguageSwitcher.jsx";
import { API_BASE_URL } from "@/services/apiClient.js";

export default function LoginPage() {
  const { t } = useTranslation();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const form = useLoginForm(login, () => navigate(from, { replace: true }));
  const oauthError = new URLSearchParams(location.search).get("oauthError");

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
  };

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, from, navigate]);

  return (
    <LayoutBackground variant="neutral">
      <div className="min-h-dvh flex items-center justify-center px-4">
        <div className="card bg-base-100/95 backdrop-blur shadow-xl w-full max-w-md">
          <div className="card-body py-8 px-6">
            <div className="flex justify-end mb-2"><LanguageSwitcher /></div>
            <h1 className="card-title text-3xl mb-1 text-center">{t("login.title")}</h1>
            <p className="text-sm opacity-70 mb-6 text-center">{t("login.subtitle")}</p>

            {oauthError && (
              <p className="text-error text-sm text-center mb-4">{t("login.googleError")}</p>
            )}

            <form id="login-form" onSubmit={form.handleSubmit} className="space-y-6">
              <div className="form-control w-full">
                <label className="label"><span className="label-text">{t("login.username")}</span></label>
                <input id="login-username" type="text" className="input input-bordered w-full"
                  value={form.username} onChange={(e) => form.setUsername(e.target.value)}
                  required autoComplete="username" disabled={form.loading} />
              </div>

              <div className="form-control w-full">
                <label className="label"><span className="label-text">{t("login.password")}</span></label>
                <input id="login-password" type="password" className="input input-bordered w-full"
                  value={form.password} onChange={(e) => form.setPassword(e.target.value)}
                  required autoComplete="current-password" disabled={form.loading} />
              </div>

              {form.error && <p id="login-error" className="text-error text-sm text-center">{form.error}</p>}

              <button id="login-submit" type="submit" className="btn btn-primary w-full mt-2" disabled={form.loading}>
                {form.loading ? (<><span className="loading loading-spinner loading-sm" /><span className="ml-2">{t("login.submitting")}</span></>) : t("login.submit")}
              </button>
            </form>

            <div className="divider text-xs opacity-60">{t("common.or")}</div>

            <button id="login-google" type="button" onClick={handleGoogleLogin} className="btn btn-outline w-full">
              {t("login.google")}
            </button>

            <div className="mt-8 pt-4 border-t text-center text-sm">
              <span className="opacity-70">{t("login.noAccount")} </span>
              <Link id="login-signup-link" to="/signup" className="link link-primary">{t("login.signupLink")}</Link>
            </div>
          </div>
        </div>
      </div>
    </LayoutBackground>
  );
}
