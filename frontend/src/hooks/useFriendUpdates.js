import { useCallback } from "react";
import { useSseEvent } from "@/hooks/useSseEvent.js";

export function useFriendUpdates(onUpdate) {
    const handler = useCallback(() => onUpdate(), [onUpdate]);
    useSseEvent("friend-update", handler);
}
