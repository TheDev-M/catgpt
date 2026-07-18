import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

export default function RenameSection({ newName, setNewName, error, onSubmit, onCancel }) {
  const { t } = useTranslation();
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form
      onSubmit={onSubmit}
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[60] w-full max-w-md bg-base-200/95 backdrop-blur rounded-2xl shadow-lg px-5 py-4 flex flex-col gap-3"
    >
      <label className="label px-1">
        <span className="label-text font-semibold">{t("catDetails.renameLabel")}</span>
      </label>
      <input
        ref={inputRef}
        type="text"
        required
        pattern="[A-Za-z][A-Za-z0-9 ]*"
        minLength={3}
        maxLength={16}
        placeholder={t("catDetails.renamePlaceholder")}
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        className={`input input-bordered w-full ${error ? "input-error" : ""}`}
      />
      {error && <p className="text-xs text-error -mt-1">{error}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>
          {t("common.cancel")}
        </button>
        <button type="submit" className="btn btn-primary btn-sm">
          {t("common.done")}
        </button>
      </div>
    </form>
  );
}
