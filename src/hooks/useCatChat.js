import { useCallback, useState } from "react";
import { chatAsCat } from "@/services/chatApi.js";

export function useCatChat(cat) {
  const [answer, setAnswer] = useState("");
  const [thinking, setThinking] = useState(false);

  const sendPrompt = useCallback(
    async (prompt) => {
      const p = (prompt ?? "").trim();
      if (!p || thinking) return;

      setThinking(true);
      try {
        const text = await chatAsCat(p, cat);
        setAnswer(text);
      } catch (e) {
        console.error("Chat error:", e);
        setAnswer("mrrp… 💤");
      } finally {
        setThinking(false);
      }
    },
    [thinking, cat]
  );

  return { answer, thinking, sendPrompt };
}
