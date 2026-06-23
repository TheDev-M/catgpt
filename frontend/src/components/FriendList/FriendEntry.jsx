import { useState } from "react";

export default function FriendEntry({ friend, onRemove, pending = false }) {
    const [loading, setLoading] = useState(false);
    const displayName = friend.nickname || friend.username;

    const handleRemove = async () => {
        setLoading(true);
        try {
            await onRemove(friend.friendshipId);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-between gap-2 bg-base-200 rounded-xl px-3 py-2">
            <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{displayName}</p>
                {friend.nickname && (
                    <p className="text-xs opacity-60 truncate font-mono">@{friend.username}</p>
                )}
                {pending && (
                    <span className="badge badge-xs badge-warning mt-0.5">Pending</span>
                )}
            </div>
            <button
                type="button"
                onClick={handleRemove}
                disabled={loading}
                className="btn btn-ghost btn-xs text-error shrink-0"
                title={pending ? "Cancel request" : "Remove friend"}
            >
                {loading ? <span className="loading loading-spinner loading-xs" /> : "✕"}
            </button>
        </div>
    );
}
