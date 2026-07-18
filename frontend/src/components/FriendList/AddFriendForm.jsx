import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function AddFriendForm({ onSend }) {
    const { t } = useTranslation();
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmed = username.trim();
        if (!trimmed) return;
        setLoading(true);
        setFeedback(null);
        try {
            await onSend(trimmed);
            setUsername("");
            setFeedback({ ok: true, msg: t("friends.requestSent") });
        } catch (err) {
            setFeedback({ ok: false, msg: err.message });
        } finally {
            setLoading(false);
            setTimeout(() => setFeedback(null), 3000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-1">
            <div className="flex gap-2">
                <input type="text" placeholder={t("friends.usernamePlaceholder")} value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="input input-sm input-bordered flex-1" disabled={loading} />
                <button type="submit" disabled={loading || !username.trim()} className="btn btn-sm btn-primary">
                    {loading ? <span className="loading loading-spinner loading-xs" /> : t("friends.add")}
                </button>
            </div>
            {feedback && <p className={`text-xs ${feedback.ok ? "text-success" : "text-error"}`}>{feedback.msg}</p>}
        </form>
    );
}
