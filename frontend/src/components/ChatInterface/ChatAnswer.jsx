import { useTranslation } from "react-i18next";

export default function ChatAnswer({ text, thinking = false }) {
  const { t } = useTranslation();
  const hasText = Boolean(text?.trim());

  const thinkingTexts = t("chat.thinking", { returnObjects: true });
  const thinkingText = Array.isArray(thinkingTexts)
    ? thinkingTexts[Math.floor(Math.random() * thinkingTexts.length)]
    : thinkingTexts;

  if (!hasText && !thinking) {
    return (
      <p className="mt-2 mb-4 md:mb-6 text-base italic text-base-content/70 text-center">
        {t("chat.idle")}
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
