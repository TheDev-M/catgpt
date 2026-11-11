import { useCallback, useState } from "react";
import { chatAsCat } from "@/services/catApi.js";

export function useCatChat(catId) {
  const [answer, setAnswer] = useState("");
  const [thinking, setThinking] = useState(false);

  const sendPrompt = useCallback(async (prompt) => {
    const trimmed = prompt?.trim();
    if (!trimmed || !catId || thinking) return;

    setThinking(true);
    try {
      // Only the cat's id goes to the server; it builds the persona from the
      // stored cat so stats cannot be spoofed by the client.
      setAnswer(await chatAsCat(trimmed, catId));
    } catch (e) {
      console.error("Chat error:", e);
      setAnswer("mrrp… 💤");
    } finally {
      setThinking(false);
    }
  }, [catId, thinking]);

  return { answer, thinking, sendPrompt };
}
