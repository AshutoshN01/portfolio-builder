/**
 * Motion Presets — Centralized easing curves, spring configs, and timing constants.
 * Per Design System §10 and Project Constitution §7.
 *
 * RULE: All Framer Motion animations must import values from this file.
 *       No inline duration/easing values are permitted (Anti-Pattern §14).
 */

// ── Easing Curves ──────────────────────────────────────
// Named cubic-bezier arrays for Framer Motion's `ease` prop.
export const easings = {
  /** Smooth deceleration (Apple-style) — default for all entrance animations */
  decelerate: [0.16, 1, 0.3, 1],

  /** Fast UI feedback — hover transitions, button fills, tag selections */
  snappy: [0.25, 1, 0.5, 1],

  /** Gentle elastic — scroll-bound parallax translations */
  parallax: [0.1, 0.8, 0.2, 1],

  /** Constant speed — progress bars and loading indicators only */
  linear: [0, 0, 1, 1],
};

// ── Spring Configurations ──────────────────────────────
// Physics-based spring params for Framer Motion's `transition.type: "spring"`.
export const springs = {
  /** MagneticButton attraction physics */
  magnetic: { type: 'spring', stiffness: 150, damping: 15 },

  /** Gentle settling for parallax elements */
  gentle: { type: 'spring', stiffness: 120, damping: 20 },

  /** Fast snap-back for press/release feedback */
  snappy: { type: 'spring', stiffness: 300, damping: 30 },
};

// ── Duration Constants (seconds) ───────────────────────
export const durations = {
  /** Focus rings appearing */
  instant: 0.1,

  /** Hover color changes, button active press */
  fast: 0.15,

  /** Content reveals, card hover lifts, slide entries */
  medium: 0.35,

  /** Page transitions, large container reveals */
  slow: 0.5,

  /** Hero entrance sequence, full-page wipes */
  glacial: 0.65,
};

// ── Delay Constants (seconds) ──────────────────────────
export const delays = {
  /** Immediate response */
  none: 0,

  /** Stagger increment between sibling elements */
  micro: 0.05,

  /** Sequential reveal offset */
  short: 0.1,

  /** Hero sub-element entry delay */
  medium: 0.2,
};

// ── Stagger Configuration ──────────────────────────────
export const stagger = {
  /** Default delay between staggered children */
  default: 0.05,

  /** Faster stagger for dense grids */
  fast: 0.03,

  /** Slower stagger for editorial reveals */
  slow: 0.08,

  /** Max children to stagger — beyond this, enter simultaneously */
  maxChildren: 8,
};
