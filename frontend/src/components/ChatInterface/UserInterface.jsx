import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function UserInterface({ onSend, disabled, placeholder }) {
  const { t } = useTranslation();
  const [val, setVal] = useState("");

  const send = () => {
    if (!val.trim() || disabled) return;
    onSend?.(val);
    setVal("");
  };

  return (
    <div className="flex flex-col items-center gap-3 pb-2 w-full">
      <input
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
        placeholder={placeholder}
        readOnly={disabled}
        className="input input-bordered w-4/5 max-w-md"
      />
      <button onClick={send} disabled={disabled} className="btn btn-primary rounded-full gap-2">
        <span>🐾</span>
        <span>{t("chat.send")}</span>
        <span>🐾</span>
      </button>
    </div>
  );
}
