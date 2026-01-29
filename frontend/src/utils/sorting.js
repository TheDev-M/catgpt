/**
 * Category priority order for sorting items
 */
const CATEGORY_ORDER = {
  FOOD: 1,
  TOY: 2,
  HYGIENE: 3,
};

/**
 * Sorts items by category (FOOD, TOY, HYGIENE) and then by effect amount
 * 
 * @param {Array} items - Array of item objects to sort
 * @returns {Array} Sorted array of items
 */
export function sortItems(items) {
  return [...items].sort((a, b) => {
    const orderA = CATEGORY_ORDER[a.category?.toUpperCase()] ?? 999;
    const orderB = CATEGORY_ORDER[b.category?.toUpperCase()] ?? 999;
    
    if (orderA !== orderB) return orderA - orderB;

    const effectA = a.effect?.amount ?? 0;
    const effectB = b.effect?.amount ?? 0;
    return effectA - effectB;
  });
}
