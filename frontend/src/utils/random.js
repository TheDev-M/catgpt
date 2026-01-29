/**
 * Generates a random number between min (inclusive) and max (exclusive)
 * 
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (exclusive)
 * @returns {number} Random integer
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Generates a random boolean value
 * 
 * @returns {boolean} Random true or false
 */
export function randomBoolean() {
  return Math.random() < 0.5;
}

/**
 * Picks a random item from an array
 * 
 * @param {Array} array - Array to pick from
 * @returns {*} Random item from the array
 */
export function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}
