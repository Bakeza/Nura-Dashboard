
// Utility functions for generating random data

/**
 * Generate a random integer between min and max (inclusive)
 */
export const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

/**
 * Generate a random float between min and max with fixed decimal places
 */
export const randomFloat = (min: number, max: number, decimals: number = 2) => {
  const num = Math.random() * (max - min) + min;
  return parseFloat(num.toFixed(decimals));
};

/**
 * Randomly select an item from an array
 */
export const randomChoice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
