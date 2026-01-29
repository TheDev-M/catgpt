/**
 * Validates a cat name according to the following rules:
 * - Must not be empty
 * - Must start with a letter
 * - Can only contain letters, numbers, and spaces
 * - Must be between 3 and 16 characters
 * - Must be unique among the user's cats
 *
 * @param {string} rawName - The name to validate
 * @param {Object} currentCat - The cat being renamed (to allow keeping the same name)
 * @param {Function} hasDuplicateName - Function to check if name already exists
 * @returns {string} Error message if invalid, empty string if valid
 */
export function validateCatName(rawName, currentCat, hasDuplicateName) {
  const trimmed = rawName.trim();

  if (!trimmed) return "Name is required.";
  if (!/^[A-Za-z][A-Za-z0-9 ]*$/.test(trimmed)) {
    return "Only letters, numbers, and spaces allowed. Must start with a letter.";
  }
  if (trimmed.length < 3) return "Name must be at least 3 characters.";
  if (trimmed.length > 16) return "Name must be less than 16 characters.";

  if (
    trimmed.toLowerCase() !== currentCat.name.toLowerCase() &&
    hasDuplicateName(trimmed, currentCat.id)
  ) {
    return `You already have a cat named "${trimmed}"`;
  }

  return "";
}
