/**
 * Motion Transitions — Reusable transition configuration objects.
 * Per Design System §10.
 *
 * These are passed to Framer Motion's `transition` prop or used
 * inside variant definitions for consistent timing.
 */
import { easings, durations } from './presets';

// ── Standard Transitions ───────────────────────────────

/** Default transition for content reveals and general animations */
export const defaultTransition = {
  duration: durations.medium,
  ease: easings.decelerate,
};

/** Fast transition for hover/active feedback */
export const fastTransition = {
  duration: durations.fast,
  ease: easings.snappy,
};

/** Slow transition for large container reveals */
export const slowTransition = {
  duration: durations.slow,
  ease: easings.decelerate,
};

/** Page-level wipe transition */
export const pageTransitionConfig = {
  duration: durations.glacial,
  ease: easings.decelerate,
};

/** Hover state transitions (border, shadow, color changes) */
export const hoverTransition = {
  duration: durations.fast,
  ease: easings.snappy,
};

// ── Viewport Configuration ─────────────────────────────

/**
 * Standard viewport trigger settings for whileInView.
 * once: true  → prevents re-triggering on scroll-up (performance)
 * margin      → triggers 80px before element enters viewport
 */
export const viewportConfig = {
  once: true,
  margin: '-80px',
};
