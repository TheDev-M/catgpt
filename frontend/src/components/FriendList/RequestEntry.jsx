import { useState } from "react";

export default function RequestEntry({ request, onApprove, onDecline }) {
    const [loading, setLoading] = useState(null);
    const displayName = request.nickname || request.username;

    const handle = async (action, fn) => {
        setLoading(action);
        try {
            await fn(request.friendshipId);
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="flex items-center justify-between gap-2 bg-base-200 rounded-xl px-3 py-2">
            <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{displayName}</p>
                {request.nickname && (
                    <p className="text-xs opacity-60 truncate font-mono">@{request.username}</p>
                )}
            </div>
            <div className="flex gap-1 shrink-0">
                <button
                    type="button"
                    onClick={() => handle("approve", onApprove)}
                    disabled={loading !== null}
                    className="btn btn-xs btn-success"
                >
                    {loading === "approve"
                        ? <span className="loading loading-spinner loading-xs" />
                        : "✓"}
                </button>
                <button
                    type="button"
                    onClick={() => handle("decline", onDecline)}
                    disabled={loading !== null}
                    className="btn btn-xs btn-error"
                >
                    {loading === "decline"
                        ? <span className="loading loading-spinner loading-xs" />
                        : "✕"}
                </button>
            </div>
        </div>
    );
}
