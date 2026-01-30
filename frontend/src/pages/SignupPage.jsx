import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth.js";
import { useSignupForm } from "@/hooks/useSignupForm.js";
import LayoutBackground from "@/components/Layouts/LayoutBackground.jsx";

export default function SignupPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const form = useSignupForm(register, () => navigate("/", { replace: true }));

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <LayoutBackground variant="neutral">
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card bg-base-100/95 backdrop-blur shadow-xl w-full max-w-md">
          <div className="card-body py-8 px-6">
            <h1
              id="signup-title"
              className="card-title text-3xl mb-1 text-center"
            >
              Create your account 😺
            </h1>
            <p
              id="signup-subtitle"
              className="text-sm opacity-70 mb-6 text-center"
            >
              You'll get your own Bob as my gift.
            </p>

            <form
              id="signup-form"
              onSubmit={form.handleSubmit}
              className="space-y-6"
            >
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  id="signup-username"
                  type="text"
                  className="input input-bordered w-full focus:mt-1"
                  value={form.username}
                  onChange={(e) => form.setUsername(e.target.value)}
                  required
                  minLength={3}
                  maxLength={24}
                  autoComplete="username"
                  disabled={form.loading}
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">
                    Tell me about yourself{" "}
                    <span className="opacity-60">(optional)</span>
                  </span>
                </label>
                <textarea
                  id="signup-description"
                  className="textarea textarea-bordered rounded-md w-full resize-none focus:mt-1"
                  rows={3}
                  value={form.description}
                  onChange={(e) => form.setDescription(e.target.value)}
                  placeholder="Write something fun for the dev to read…"
                  maxLength={300}
                  disabled={form.loading}
                />
                <span className="label-text-alt opacity-60 text-xs mt-1">
                  This is just a note for the dev, not visible to others.
                </span>
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  id="signup-password"
                  type="password"
                  className="input input-bordered w-full focus:mt-1"
                  value={form.password}
                  onChange={(e) => form.setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  disabled={form.loading}
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Confirm password</span>
                </label>
                <input
                  id="signup-confirm-password"
                  type="password"
                  className="input input-bordered w-full focus:mt-1"
                  value={form.confirm}
                  onChange={(e) => form.setConfirm(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  disabled={form.loading}
                />
              </div>

              {form.error && (
                <p id="signup-error" className="text-error text-sm text-center">
                  {form.error}
                </p>
              )}

              <button
                id="signup-submit"
                type="submit"
                className="btn btn-primary w-full mt-2"
                disabled={form.loading}
              >
                {form.loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    <span className="ml-2">Signing you up…</span>
                  </>
                ) : (
                  "Sign up"
                )}
              </button>
            </form>

            <div className="mt-8 pt-4 border-t text-center text-sm">
              <span className="opacity-70">Already have an account? </span>
              <Link
                id="signup-login-link"
                to="/login"
                className="link link-primary"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </LayoutBackground>
  );
}
