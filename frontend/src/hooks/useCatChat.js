import { useState } from "react";
import { chatAsCat } from "@/services/catApi.js";

export function useCatChat(cat) {
  const [answer, setAnswer] = useState("");
  const [thinking, setThinking] = useState(false);

  const sendPrompt = async (prompt) => {
    const trimmed = prompt?.trim();
    if (!trimmed || thinking) return;

    setThinking(true);
    try {
      const text = await chatAsCat(trimmed, cat);
      setAnswer(text);
    } catch (e) {
      console.error("Chat error:", e);
      setAnswer("mrrp… 💤");
    } finally {
      setThinking(false);
    }
  };

  return { answer, thinking, sendPrompt };
}
