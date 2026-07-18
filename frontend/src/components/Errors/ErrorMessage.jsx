import { useTranslation } from "react-i18next";

export default function ErrorMessage({ title, message, onRetry }) {
  const { t } = useTranslation();
  return (
    <div className="w-full max-w-md p-4 rounded-xl border border-error/30 bg-error/10 text-error text-center">
      <h3 className="font-semibold mb-1">{title ?? t("error.generic")}</h3>
      {message && <p className="text-sm opacity-80 mb-3">{message}</p>}
      {onRetry && (
        <button className="btn btn-sm btn-error" onClick={onRetry}>
          {t("common.tryAgain")}
        </button>
      )}
    </div>
  );
}
