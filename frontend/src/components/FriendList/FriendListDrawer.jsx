import { useState } from "react";
import { useTranslation } from "react-i18next";
import AddFriendForm from "./AddFriendForm.jsx";
import FriendEntry from "./FriendEntry.jsx";
import RequestEntry from "./RequestEntry.jsx";

export default function FriendListDrawer({ onClose, friends, incoming, outgoing, loading, error, onSendRequest, onApprove, onDecline, onRemove, onBorrowed, borrowedCatId, onReturnCat }) {
    const { t } = useTranslation();
    const [tab, setTab] = useState("friends");

    return (
        <div id="friend-list-drawer" className="h-full flex flex-col">
            <div className="px-4 py-3 border-b border-base-300 flex items-center justify-between">
                <h2 className="font-bold text-lg">{t("friends.title")}</h2>
                <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
            </div>

            <div className="px-4 pt-3">
                <AddFriendForm onSend={onSendRequest} />
            </div>

            {borrowedCatId && (
                <div className="mx-4 mt-3 flex items-center justify-between gap-2 bg-warning/20 border border-warning/40 rounded-xl px-3 py-2">
                    <span className="text-xs font-semibold">{t("friends.borrowingBanner")}</span>
                    <button type="button" onClick={() => onReturnCat(borrowedCatId)} className="btn btn-xs btn-warning">
                        {t("friends.return")}
                    </button>
                </div>
            )}

            <div className="px-4 pt-3 flex gap-1">
                <TabButton active={tab === "friends"} onClick={() => setTab("friends")}>
                    {t("friends.friendsTab")} {friends.length > 0 && <span className="badge badge-xs badge-neutral ml-1">{friends.length}</span>}
                </TabButton>
                <TabButton active={tab === "requests"} onClick={() => setTab("requests")}>
                    {t("friends.requestsTab")} {incoming.length > 0 && <span className="badge badge-xs badge-warning ml-1">{incoming.length}</span>}
                </TabButton>
                <TabButton active={tab === "outgoing"} onClick={() => setTab("outgoing")}>
                    {t("friends.sentTab")} {outgoing.length > 0 && <span className="badge badge-xs badge-ghost ml-1">{outgoing.length}</span>}
                </TabButton>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                {loading ? (
                    <LoadingRows />
                ) : error ? (
                    <p className="text-sm opacity-70 text-center">{error}</p>
                ) : tab === "friends" ? (
                    friends.length === 0 ? (
                        <Empty>{t("friends.noFriends")}</Empty>
                    ) : (
                        friends.map(f => <FriendEntry key={f.friendshipId} friend={f} onRemove={onRemove} onBorrowed={onBorrowed} />)
                    )
                ) : tab === "requests" ? (
                    incoming.length === 0 ? (
                        <Empty>{t("friends.noIncoming")}</Empty>
                    ) : (
                        incoming.map(r => <RequestEntry key={r.friendshipId} request={r} onApprove={onApprove} onDecline={onDecline} />)
                    )
                ) : (
                    outgoing.length === 0 ? (
                        <Empty>{t("friends.noOutgoing")}</Empty>
                    ) : (
                        outgoing.map(r => <FriendEntry key={r.friendshipId} friend={r} onRemove={onRemove} pending />)
                    )
                )}
            </div>
        </div>
    );
}

function TabButton({ active, onClick, children }) {
    return (
        <button type="button" onClick={onClick} className={`btn btn-xs flex-1 ${active ? "btn-primary" : "btn-ghost"}`}>
            {children}
        </button>
    );
}

function Empty({ children }) {
    return <p className="text-sm opacity-60 text-center pt-4">{children}</p>;
}

function LoadingRows() {
    return (
        <div className="space-y-2">
            {[1, 2, 3].map(i => <div key={i} className="skeleton h-12 w-full rounded-xl" />)}
        </div>
    );
}
