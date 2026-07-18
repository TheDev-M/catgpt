import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function LandscapeBlocker() {
  const { t } = useTranslation();
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const check = () => setBlocked(window.innerHeight < 500 && window.innerWidth > window.innerHeight);
    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);

  if (!blocked) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-base-100 flex flex-col items-center justify-center gap-4 p-8 text-center">
      <span className="text-6xl select-none">📱</span>
      <h2 className="text-xl font-bold">{t("landscape.title")}</h2>
      <p className="text-sm opacity-60">{t("landscape.message")}</p>
    </div>
  );
}
