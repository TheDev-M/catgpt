import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "en", flag: "🇬🇧" },
  { code: "hu", flag: "🇭🇺" },
  { code: "de", flag: "🇩🇪" },
  { code: "es", flag: "🇪🇸" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language?.slice(0, 2) ?? "en";

  return (
    <div className="dropdown dropdown-end">
      <button tabIndex={0} type="button" className="btn btn-ghost btn-xs px-1 text-base">
        {LANGUAGES.find(l => l.code === current)?.flag ?? "🌐"}
      </button>
      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box shadow z-50 p-1 gap-0.5">
        {LANGUAGES.map(({ code, flag }) => (
          <li key={code}>
            <button
              type="button"
              className={`btn btn-ghost btn-xs justify-start gap-2 ${current === code ? "btn-active" : ""}`}
              onClick={() => i18n.changeLanguage(code)}
            >
              {flag} {code.toUpperCase()}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
