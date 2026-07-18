import { useState } from "react";
import { useTranslation } from "react-i18next";
import BorrowCatPanel from "./BorrowCatPanel.jsx";

export default function FriendEntry({ friend, onRemove, onBorrowed, pending = false }) {
    const { t } = useTranslation();
    const [removeLoading, setRemoveLoading] = useState(false);
    const [catsOpen, setCatsOpen] = useState(false);
    const displayName = friend.nickname || friend.username;

    const handleRemove = async () => {
        setRemoveLoading(true);
        try { await onRemove(friend.friendshipId); }
        finally { setRemoveLoading(false); }
    };

    return (
        <div className="bg-base-200 rounded-xl px-3 py-2 space-y-1">
            <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{displayName}</p>
                    {friend.nickname && <p className="text-xs opacity-60 truncate font-mono">@{friend.username}</p>}
                    {pending && <span className="badge badge-xs badge-warning mt-0.5">{t("friends.pending")}</span>}
                </div>
                <div className="flex gap-1 shrink-0">
                    {!pending && (
                        <button type="button" onClick={() => setCatsOpen(o => !o)}
                            className={`btn btn-xs ${catsOpen ? "btn-primary" : "btn-ghost"}`}
                            title={t("friends.borrowCat")}>
                            🐱
                        </button>
                    )}
                    <button type="button" onClick={handleRemove} disabled={removeLoading}
                        className="btn btn-ghost btn-xs text-error"
                        title={pending ? t("friends.cancelRequest") : t("friends.removeFriend")}>
                        {removeLoading ? <span className="loading loading-spinner loading-xs" /> : "✕"}
                    </button>
                </div>
            </div>

            {catsOpen && !pending && <BorrowCatPanel friendshipId={friend.friendshipId} onBorrowed={onBorrowed} />}
        </div>
    );
}
