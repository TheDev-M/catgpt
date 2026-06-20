import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth.js";
import { updateNickname, changePassword } from "@/services/userApi.js";
import LayoutBackground from "@/components/Layouts/LayoutBackground.jsx";

export default function ProfilePage() {
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();

    const isGoogleUser = user?.authProvider === "GOOGLE";

    const [nickname, setNickname] = useState(user?.nickname ?? "");
    const [nicknameStatus, setNicknameStatus] = useState(null);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordStatus, setPasswordStatus] = useState(null);

    const handleNicknameSubmit = async (e) => {
        e.preventDefault();
        setNicknameStatus("saving");
        try {
            await updateNickname(nickname.trim() || null);
            await refreshUser();
            setNicknameStatus("saved");
            setTimeout(() => setNicknameStatus(null), 2500);
        } catch (err) {
            setNicknameStatus(err.message);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setPasswordStatus("New passwords do not match.");
            return;
        }
        setPasswordStatus("saving");
        try {
            await changePassword(currentPassword, newPassword);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setPasswordStatus("saved");
            setTimeout(() => setPasswordStatus(null), 2500);
        } catch (err) {
            setPasswordStatus(err.message);
        }
    };

    return (
        <LayoutBackground variant="warm">
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => navigate(-1)}
                        >
                            ← Back
                        </button>
                        <h1 className="text-2xl font-bold">Profile</h1>
                    </div>

                    <div className="text-sm opacity-60">
                        Username: <span className="font-mono font-semibold">{user?.username}</span>
                    </div>

                    <div className="card bg-base-200 shadow-md rounded-2xl">
                        <div className="card-body space-y-3">
                            <h2 className="card-title text-lg">Display name</h2>
                            <p className="text-sm opacity-60">
                                This is shown in the app. Duplicates are allowed.
                            </p>
                            <form onSubmit={handleNicknameSubmit} className="space-y-3">
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    placeholder="Leave blank to use your username"
                                    value={nickname}
                                    maxLength={64}
                                    onChange={(e) => setNickname(e.target.value)}
                                />
                                {nicknameStatus && nicknameStatus !== "saving" && nicknameStatus !== "saved" && (
                                    <p className="text-sm text-error">{nicknameStatus}</p>
                                )}
                                {nicknameStatus === "saved" && (
                                    <p className="text-sm text-success">Display name saved.</p>
                                )}
                                <button
                                    type="submit"
                                    className="btn btn-primary w-full"
                                    disabled={nicknameStatus === "saving"}
                                >
                                    {nicknameStatus === "saving" ? (
                                        <span className="loading loading-spinner loading-sm" />
                                    ) : (
                                        "Save"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="card bg-base-200 shadow-md rounded-2xl">
                        <div className="card-body space-y-3">
                            <h2 className="card-title text-lg">Change password</h2>
                            {isGoogleUser ? (
                                <p className="text-sm opacity-60">
                                    Your account uses Google sign-in. Password change is not available.
                                </p>
                            ) : (
                                <form onSubmit={handlePasswordSubmit} className="space-y-3">
                                    <input
                                        type="password"
                                        className="input input-bordered w-full"
                                        placeholder="Current password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                    <input
                                        type="password"
                                        className="input input-bordered w-full"
                                        placeholder="New password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <input
                                        type="password"
                                        className="input input-bordered w-full"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    {passwordStatus && passwordStatus !== "saving" && passwordStatus !== "saved" && (
                                        <p className="text-sm text-error">{passwordStatus}</p>
                                    )}
                                    {passwordStatus === "saved" && (
                                        <p className="text-sm text-success">Password changed successfully.</p>
                                    )}
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-full"
                                        disabled={passwordStatus === "saving"}
                                    >
                                        {passwordStatus === "saving" ? (
                                            <span className="loading loading-spinner loading-sm" />
                                        ) : (
                                            "Change password"
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </LayoutBackground>
    );
}
