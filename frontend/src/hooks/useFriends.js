import { useState, useCallback, useEffect } from "react";
import {
    getFriends,
    getIncomingRequests,
    getOutgoingRequests,
    sendFriendRequest,
    approveRequest,
    declineRequest,
    removeFriend
} from "@/services/friendApi.js";
import { returnCat } from "@/services/borrowApi.js";
import { useFriendUpdates } from "@/hooks/useFriendUpdates.js";
import { useSseEvent } from "@/hooks/useSseEvent.js";

export function useFriends(open) {
    const [friends, setFriends] = useState([]);
    const [incoming, setIncoming] = useState([]);
    const [outgoing, setOutgoing] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [f, i, o] = await Promise.all([
                getFriends(),
                getIncomingRequests(),
                getOutgoingRequests()
            ]);
            setFriends(f);
            setIncoming(i);
            setOutgoing(o);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (open) fetchAll();
    }, [open, fetchAll]);

    useFriendUpdates(fetchAll);
    // Also refetch when a borrow state changes (owner reclaims, etc.)
    useSseEvent("cat-borrow-update", fetchAll);

    const sendRequest = useCallback(async (username) => {
        const newEntry = await sendFriendRequest(username);
        setOutgoing(prev => [...prev, newEntry]);
    }, []);

    const approve = useCallback(async (friendshipId) => {
        const approved = await approveRequest(friendshipId);
        setIncoming(prev => prev.filter(r => r.friendshipId !== friendshipId));
        setFriends(prev => [...prev, approved]);
    }, []);

    const decline = useCallback(async (friendshipId) => {
        await declineRequest(friendshipId);
        setIncoming(prev => prev.filter(r => r.friendshipId !== friendshipId));
    }, []);

    const remove = useCallback(async (friendshipId) => {
        await removeFriend(friendshipId);
        setFriends(prev => prev.filter(f => f.friendshipId !== friendshipId));
        setOutgoing(prev => prev.filter(f => f.friendshipId !== friendshipId));
    }, []);

    const returnBorrowed = useCallback(async (catId) => {
        await returnCat(catId);
    }, []);

    return { friends, incoming, outgoing, loading, error, sendRequest, approve, decline, remove, returnBorrowed };
}
