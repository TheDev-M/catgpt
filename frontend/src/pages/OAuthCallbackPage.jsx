import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth.js";
import LayoutBackground from "@/components/Layouts/LayoutBackground.jsx";

export default function OAuthCallbackPage() {
    const { loginWithOAuthToken } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [error, setError] = useState("");
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const token = searchParams.get("token");

        if (!token) {
            setError("Google sign-in failed. Please try again.");
            return;
        }

        loginWithOAuthToken(token)
            .then(() => navigate("/", { replace: true }))
            .catch(() => setError("Google sign-in failed. Please try again."));
    }, [searchParams, loginWithOAuthToken, navigate]);

    return (
        <LayoutBackground variant="neutral">
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="card bg-base-100/95 backdrop-blur shadow-xl w-full max-w-md">
                    <div className="card-body py-8 px-6 items-center text-center">
                        {error ? (
                            <>
                                <p className="text-error text-sm mb-4">{error}</p>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => navigate("/login", { replace: true })}
                                >
                                    Back to login
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="loading loading-spinner loading-lg mb-4" />
                                <p className="text-sm opacity-70">Signing you in…</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </LayoutBackground>
    );
}