import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { chatAsCat } from "@/services/catApi.js";

export function useCatChat(catId) {
  const { i18n } = useTranslation();
  const [answer, setAnswer] = useState("");
  const [thinking, setThinking] = useState(false);

  const language = i18n.language;

  const sendPrompt = useCallback(async (prompt) => {
    const trimmed = prompt?.trim();
    if (!trimmed || !catId || thinking) return;

    setThinking(true);
    try {
      // Only the cat's id goes to the server; it builds the persona from the
      // stored cat so stats cannot be spoofed by the client. The locale is a
      // hint for short prompts — the cat otherwise mirrors whatever it is told.
      setAnswer(await chatAsCat(trimmed, catId, language));
    } catch (e) {
      console.error("Chat error:", e);
      setAnswer("mrrp… 💤");
    } finally {
      setThinking(false);
    }
  }, [catId, thinking, language]);

  return { answer, thinking, sendPrompt };
}
