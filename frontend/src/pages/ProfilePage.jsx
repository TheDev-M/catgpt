import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth.js";
import { updateNickname, changePassword } from "@/services/userApi.js";
import LayoutBackground from "@/components/Layouts/LayoutBackground.jsx";

function Avatar({ user }) {
    const letter = (user?.nickname ?? user?.username ?? "?")[0].toUpperCase();
    return (
        <div className="w-20 h-20 rounded-full bg-primary/20 border-4 border-primary/30 flex items-center justify-center shrink-0">
            <span className="text-3xl font-bold text-primary">{letter}</span>
        </div>
    );
}

function StatusBadge({ isGoogle }) {
    const { t } = useTranslation();
    return (
        <span className={`badge badge-sm font-medium ${isGoogle ? "badge-warning" : "badge-ghost border border-base-300"}`}>
            {isGoogle ? t("profile.googleAccount") : t("profile.localAccount")}
        </span>
    );
}

function FieldLabel({ children }) {
    return <label className="text-xs font-semibold uppercase tracking-wider opacity-50">{children}</label>;
}

function FeedbackMessage({ status }) {
    const { t } = useTranslation();
    if (!status || status === "saving") return null;
    if (status === "saved") return <p className="text-xs text-success font-medium">{t("profile.saved")}</p>;
    return <p className="text-xs text-error">{status}</p>;
}

export default function ProfilePage() {
    const { t } = useTranslation();
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
            setPasswordStatus(t("profile.passwordMismatch"));
            return;
        }
        setPasswordStatus("saving");
        try {
            await changePassword(currentPassword, newPassword);
            setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
            setPasswordStatus("saved");
            setTimeout(() => setPasswordStatus(null), 2500);
        } catch (err) {
            setPasswordStatus(err.message);
        }
    };

    return (
        <LayoutBackground variant="warm">
            <div className="min-h-screen flex flex-col items-center py-10 px-4">
                <div className="w-full max-w-lg mb-6">
                    <button type="button" className="btn btn-ghost btn-sm gap-1 pl-0 hover:pl-1 transition-all" onClick={() => navigate(-1)}>
                        {t("profile.back")}
                    </button>
                </div>

                <div className="w-full max-w-lg flex items-center gap-5 mb-8 px-1">
                    <Avatar user={user} />
                    <div className="flex flex-col gap-1 min-w-0">
                        <h1 className="text-2xl font-bold truncate">{user?.nickname ?? user?.username}</h1>
                        <span className="text-sm opacity-50 font-mono truncate">@{user?.username}</span>
                        <StatusBadge isGoogle={isGoogleUser} />
                    </div>
                </div>

                <div className="w-full max-w-lg bg-base-200 rounded-2xl shadow-sm mb-4 overflow-hidden">
                    <div className="px-6 py-4 border-b border-base-300">
                        <h2 className="font-semibold text-base">{t("profile.displayName")}</h2>
                        <p className="text-xs opacity-50 mt-0.5">{t("profile.displayNameHint")}</p>
                    </div>
                    <form onSubmit={handleNicknameSubmit} className="px-6 py-5 space-y-4">
                        <div className="space-y-1.5">
                            <input type="text" className="input input-bordered w-full"
                                placeholder={user?.username ?? ""} value={nickname} maxLength={64}
                                onChange={(e) => setNickname(e.target.value)} />
                            <p className="text-xs opacity-40">{t("profile.displayNameHint2")}</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <FeedbackMessage status={nicknameStatus} />
                            <button type="submit" className="btn btn-primary btn-sm ml-auto" disabled={nicknameStatus === "saving"}>
                                {nicknameStatus === "saving" ? <span className="loading loading-spinner loading-xs" /> : t("common.save")}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="w-full max-w-lg bg-base-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-base-300">
                        <h2 className="font-semibold text-base">{t("profile.password")}</h2>
                        <p className="text-xs opacity-50 mt-0.5">
                            {isGoogleUser ? t("profile.passwordHintGoogle") : t("profile.passwordHintMin")}
                        </p>
                    </div>
                    {isGoogleUser ? (
                        <div className="px-6 py-5 flex items-center gap-3 opacity-50">
                            <span className="text-2xl">🔒</span>
                            <p className="text-sm">{t("profile.googleManaged")}</p>
                        </div>
                    ) : (
                        <form onSubmit={handlePasswordSubmit} className="px-6 py-5 space-y-4">
                            <div className="space-y-1.5">
                                <FieldLabel>{t("profile.currentPassword")}</FieldLabel>
                                <input type="password" className="input input-bordered w-full" placeholder="••••••••"
                                    value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <FieldLabel>{t("profile.newPassword")}</FieldLabel>
                                    <input type="password" className="input input-bordered w-full" placeholder="••••••••"
                                        value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <FieldLabel>{t("profile.confirm")}</FieldLabel>
                                    <input type="password" className="input input-bordered w-full" placeholder="••••••••"
                                        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <FeedbackMessage status={passwordStatus} />
                                <button type="submit" className="btn btn-primary btn-sm ml-auto" disabled={passwordStatus === "saving"}>
                                    {passwordStatus === "saving" ? <span className="loading loading-spinner loading-xs" /> : t("profile.updatePassword")}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </LayoutBackground>
    );
}
