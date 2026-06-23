import { useState, useEffect, useCallback } from "react";
import { getFriendCats, borrowCat } from "@/services/borrowApi.js";
import { useSseEvent } from "@/hooks/useSseEvent.js";

export default function BorrowCatPanel({ friendshipId, onBorrowed }) {
    const [cats, setCats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [borrowingId, setBorrowingId] = useState(null);
    const [feedback, setFeedback] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            setCats(await getFriendCats(friendshipId));
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [friendshipId]);

    useEffect(() => { load(); }, [load]);

    // Refresh when the owner's borrow state changes (e.g. owner reclaims)
    useSseEvent("cat-borrow-update", load);

    const handleBorrow = async (cat) => {
        setBorrowingId(cat.id);
        setFeedback(null);
        try {
            await borrowCat(cat.id);
            setFeedback({ ok: true, msg: `Now borrowing ${cat.name}!` });
            onBorrowed?.(cat.id);
            load();
        } catch (e) {
            setFeedback({ ok: false, msg: e.message });
        } finally {
            setBorrowingId(null);
            setTimeout(() => setFeedback(null), 3000);
        }
    };

    if (loading) return (
        <div className="space-y-1 pt-1">
            {[1, 2].map(i => <div key={i} className="skeleton h-10 w-full rounded-lg" />)}
        </div>
    );

    if (error) return <p className="text-xs text-error pt-1">{error}</p>;

    if (cats.length === 0) return (
        <p className="text-xs opacity-60 pt-1">This friend has no cats.</p>
    );

    return (
        <div className="space-y-1 pt-1">
            {feedback && (
                <p className={`text-xs ${feedback.ok ? "text-success" : "text-error"}`}>
                    {feedback.msg}
                </p>
            )}
            {cats.map(cat => (
                <div key={cat.id} className="flex items-center gap-2 bg-base-100 rounded-lg px-2 py-1.5">
                    {cat.image && (
                        <img src={cat.image} alt={cat.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">{cat.name}</p>
                        <p className="text-xs opacity-50 truncate">{cat.breed}</p>
                    </div>
                    {cat.available ? (
                        <button
                            type="button"
                            onClick={() => handleBorrow(cat)}
                            disabled={borrowingId !== null}
                            className="btn btn-xs btn-primary shrink-0"
                        >
                            {borrowingId === cat.id
                                ? <span className="loading loading-spinner loading-xs" />
                                : "Borrow"}
                        </button>
                    ) : (
                        <span className="text-xs opacity-50 shrink-0 italic">
                            {cat.borrowedByUsername ? `@${cat.borrowedByUsername}` : "In use"}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}
