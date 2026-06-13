/**
 * Utility Helpers
 * General-purpose functions used across the portfolio.
 */

/**
 * Checks if the user has requested reduced motion.
 * Used to disable spatial animations and fall back to opacity-only fades.
 * @returns {boolean} True if reduced motion is preferred.
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Formats a number with locale-appropriate separators.
 * @param {number} num - The number to format.
 * @returns {string} Formatted string (e.g., 1,234,567).
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num);
};

/**
 * Clamps a value between a minimum and maximum.
 * @param {number} value - The value to clamp.
 * @param {number} min - Minimum bound.
 * @param {number} max - Maximum bound.
 * @returns {number} Clamped value.
 */
export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};
