// Letters from any script, so names like "Bögre", "Müller" or "José" are accepted —
// the app ships in four languages and an ASCII-only rule would reject three of them.
const NAME_PATTERN = /^\p{L}[\p{L}\p{N} ]*$/u;

export const NAME_MIN_LENGTH = 3;
export const NAME_MAX_LENGTH = 16;

export function validateCatName(rawName, currentCat, hasDuplicateName) {
  const trimmed = (rawName ?? "").trim();

  if (!trimmed) return { key: "validation.nameRequired" };
  if (!NAME_PATTERN.test(trimmed)) return { key: "validation.nameInvalid" };
  if (trimmed.length < NAME_MIN_LENGTH) return { key: "validation.nameTooShort" };
  if (trimmed.length > NAME_MAX_LENGTH) return { key: "validation.nameTooLong" };

  if (
    trimmed.toLowerCase() !== currentCat.name.toLowerCase() &&
    hasDuplicateName(trimmed, currentCat.id)
  ) {
    return { key: "validation.nameDuplicate", options: { name: trimmed } };
  }

  return null;
}
