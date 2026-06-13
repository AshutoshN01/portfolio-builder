/**
 * Motion Variants — Framer Motion variant objects for entrance/exit animations.
 * Per Design System §10 and Motion Component Standards (Constitution §6).
 *
 * Each variant defines `hidden` (initial) and `visible` (animate) states.
 * Components import these directly: <motion.div variants={fadeUp} />
 *
 * RULE: Never duplicate these values inline. Import from this file.
 */
import { easings, durations } from './presets';

// ── Fade + Directional Slide Variants ──────────────────

/** Fade in while sliding up from below (most common reveal) */
export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.medium,
      ease: easings.decelerate,
    },
  },
};

/** Fade in while sliding down from above */
export const fadeDown = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.medium,
      ease: easings.decelerate,
    },
  },
};

/** Fade in while sliding from the left */
export const fadeLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: durations.medium,
      ease: easings.decelerate,
    },
  },
};

/** Fade in while sliding from the right */
export const fadeRight = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: durations.medium,
      ease: easings.decelerate,
    },
  },
};

// ── Reveal Variants ────────────────────────────────────

/** Deep reveal — larger Y offset for dramatic section entrances */
export const reveal = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slow,
      ease: easings.decelerate,
    },
  },
};

/** Scale in — subtle zoom for cards and media */
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: durations.medium,
      ease: easings.decelerate,
    },
  },
};

// ── Container Variants ─────────────────────────────────

/**
 * Stagger container — orchestrates child element reveals.
 * Children must use their own variants (fadeUp, fadeLeft, etc.).
 * Max 8 children stagger (0.4s total). Beyond 8, enter simultaneously.
 */
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

/** Fast stagger for dense skill grids */
export const staggerContainerFast = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.05,
    },
  },
};

// ── Page Transition Variants ───────────────────────────

/** Full page enter/exit animation for route changes */
export const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slow,
      ease: easings.decelerate,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: durations.medium,
      ease: easings.snappy,
    },
  },
};
