/**
 * Reusable Framer Motion variants and helpers for MyTech-Fix.
 * 
 * Design rules:
 * - Subtle, fast, premium feel (never flashy).
 * - Use the same cubic-bezier as our CSS tokens.
 * - Respect reduced motion (via MotionConfig at root).
 * - Keep durations short for tool-like pages (chat, dashboard, history).
 */

import { Variants } from 'framer-motion';

export const EASING = [0.23, 1, 0.32, 1] as const;

/** Standard entrance for a single element */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: EASING },
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: { duration: 0.2, ease: EASING },
  },
};

/** Container that staggers its direct children */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.03,
    },
  },
};

/** Slightly slower stagger for marketing/hero surfaces */
export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
};

/** Card-level hover / tap (use on card-premium wrappers).
 *  Usage: <motion.div {...cardInteractive} ... >
 *  Note: spread after variants if both are used.
 */
export const cardInteractive = {
  whileHover: {
    y: -3,
  } as const,
  whileTap: {
    scale: 0.985,
  } as const,
  transition: { type: 'spring', stiffness: 380, damping: 26 } as const,
};

/** Button micro interaction (pairs with .btn-premium) */
export const buttonInteractive = {
  whileHover: {
    scale: 1.01,
    transition: { type: 'spring', stiffness: 400, damping: 20 },
  },
  whileTap: {
    scale: 0.97,
  },
};

/** For chat messages – very light so it doesn't feel slow */
export const messageIn: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.22, ease: EASING },
  },
};

/** For forms / side panels that conditionally appear */
export const slideDown: Variants = {
  hidden: { opacity: 0, y: -8, height: 0 },
  visible: {
    opacity: 1,
    y: 0,
    height: 'auto',
    transition: { duration: 0.28, ease: EASING },
  },
  exit: {
    opacity: 0,
    y: -6,
    height: 0,
    transition: { duration: 0.2, ease: EASING },
  },
};

/** Modal content (used inside DialogContent) */
export const modalContent: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.2, ease: EASING },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 6,
    transition: { duration: 0.15, ease: EASING },
  },
};

/** Simple fade for overlays or loading states */
export const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

/**
 * Helper you can spread on a motion.ul / motion.div when you want
 * staggered children without defining variants on every child.
 */
export function getStaggerProps(delay = 0.03) {
  return {
    initial: 'hidden',
    animate: 'visible',
    variants: {
      hidden: {},
      visible: {
        transition: { staggerChildren: 0.06, delayChildren: delay },
      },
    } as Variants,
  };
}
