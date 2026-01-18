import { useRef } from "react";

export default function NicknameForm({
                                         nickname,
                                         setNickname,
                                         hint,
                                         error,
                                         onSubmit,
                                         onCancel,
                                     }) {
    const inputRef = useRef(null);

    function handleInput(e) {
        setNickname(e.target.value);
    }

    return (
        <form id="caught-cat-form" onSubmit={onSubmit} className="space-y-3">
            <label className="block font-bold text-lg text-center">
                Give it a nickname:
            </label>

            <input
                id="caught-cat-nickname-input"
                ref={inputRef}
                type="text"
                required
                minLength={3}
                maxLength={16}
                value={nickname}
                onChange={handleInput}
                placeholder="Type a nickname"
                className={`input validator input-bordered w-full ${
                    error ? "input-error" : ""
                }`}
            />

            {hint && (
                <p id="caught-cat-hint" className="text-xs text-warning mt-1">
                    {hint}
                </p>
            )}

            {error && (
                <p id="caught-cat-error" className="text-error text-sm text-center">{error}</p>
            )}

            <div className="flex justify-center gap-3 pt-2">
                <button
                    id="caught-cat-save-button"
                    type="submit"
                    className="btn btn-primary rounded-full text-primary-content"
                >
                    Save
                </button>

                <button
                    id="caught-cat-cancel-button"
                    type="button"
                    onClick={onCancel}
                    className="btn btn-ghost rounded-full"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
