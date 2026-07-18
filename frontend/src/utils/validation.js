export function validateCatName(rawName, currentCat, hasDuplicateName) {
  const trimmed = rawName.trim();

  if (!trimmed) return { key: "validation.nameRequired" };
  if (!/^[A-Za-z][A-Za-z0-9 ]*$/.test(trimmed)) return { key: "validation.nameInvalid" };
  if (trimmed.length < 3) return { key: "validation.nameTooShort" };
  if (trimmed.length > 16) return { key: "validation.nameTooLong" };

  if (
    trimmed.toLowerCase() !== currentCat.name.toLowerCase() &&
    hasDuplicateName(trimmed, currentCat.id)
  ) {
    return { key: "validation.nameDuplicate", options: { name: trimmed } };
  }

  return null;
}
