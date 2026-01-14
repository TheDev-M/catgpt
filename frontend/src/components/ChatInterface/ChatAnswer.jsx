import { getRandomCatThinking } from "@/constants/getRandomCatThinking.js";

export default function ChatAnswer({ text, thinking = false }) {
  const hasText = Boolean(text?.trim());
  const thinkingText = getRandomCatThinking();

  if (!hasText && !thinking) {
    return (
      <p className="mt-2 mb-4 md:mb-6 text-base italic text-base-content/70 text-center">
        Patiently purring until you speak… 🐈
      </p>
    );
  }

  if (thinking) {
    return (
      <p className="mt-2 mb-4 md:mb-6 text-sm text-base-content/70 text-center animate-pulse">
        {thinkingText}
      </p>
    );
  }

  return (
    <p className="mt-2 mb-4 md:mb-6 text-base italic px-4 py-2 bg-base-200 rounded-lg max-w-sm text-center">
      {text}
    </p>
  );
}
