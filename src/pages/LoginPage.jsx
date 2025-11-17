import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth.js";
import LayoutBackground from "@/components/Layouts/LayoutBackground.jsx";

export default function LoginPage() {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // (Optional) avoid navigate in render:
    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, from, navigate]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await login(username.trim(), password);
            navigate(from, { replace: true });
        } catch {
            setError("Invalid username or password.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <LayoutBackground variant="neutral">
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="card bg-base-100/95 backdrop-blur shadow-xl w-full max-w-md">
                    <div className="card-body py-8 px-6">
                        <h1 className="card-title text-3xl mb-1 text-center">
                            Welcome back 🐾
                        </h1>
                        <p className="text-sm opacity-70 mb-6 text-center">
                            Log in to chat with your cats.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Username</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full focus:mt-1"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    autoComplete="username"
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <input
                                    type="password"
                                    className="input input-bordered w-full focus:mt-1"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    disabled={isLoading}
                                />
                            </div>

                            {error && (
                                <p className="text-error text-sm text-center">{error}</p>
                            )}

                            <button
                                type="submit"
                                className="btn btn-primary w-full mt-2"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm" />
                                        <span className="ml-2">Logging in…</span>
                                    </>
                                ) : (
                                    "Log in"
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-4 border-t text-center text-sm">
                            <span className="opacity-70">Don't have an account? </span>
                            <Link to="/signup" className="link link-primary">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutBackground>
    );
}
