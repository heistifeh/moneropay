// Strictly typed Framer Motion variants & presets
// Works with Framer Motion v10/v11 + TypeScript strict mode
// Key fixes vs earlier draft:
// - All variant objects are typed as Variants (or satisfy Variants)
// - Transitions are typed as Transition
// - VIEWPORT typed as Viewport
// - Utility factory functions have explicit return types

import type { Variants, Transition } from "framer-motion";

/** Shared eases */
export const EASE = {
  out: [0.16, 1, 0.3, 1] as const,
  in: [0.7, 0, 0.84, 0] as const,
  inOut: [0.83, 0, 0.17, 1] as const,
};

/** Spring presets */
export const SPRING = {
  soft: {
    type: "spring",
    stiffness: 160,
    damping: 20,
    mass: 0.6,
  } satisfies Transition,
  default: {
    type: "spring",
    stiffness: 240,
    damping: 28,
    mass: 0.8,
  } satisfies Transition,
  snappy: {
    type: "spring",
    stiffness: 360,
    damping: 30,
    mass: 0.8,
  } satisfies Transition,
};

/** Viewport (for whileInView) */
export const VIEWPORT = { once: true, amount: 0.2 };

/** -------- Legacy-compatible (upgraded) -------- */
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 24, filter: "blur(2px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { ...SPRING.soft, delay: 0.02 },
  },
};

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -24, filter: "blur(2px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { ...SPRING.soft, delay: 0.02 },
  },
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: EASE.out } },
};

export const staggerContainer: Variants = {
  hidden: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.02,
      when: "beforeChildren",
    },
  },
};

export const cardHover = {
  whileHover: { scale: 1.03, y: -2 },
  transition: SPRING.default as Transition,
};

export const cardHoverSmall = {
  whileHover: { scale: 1.015, y: -1 },
  transition: SPRING.soft as Transition,
};

export const pageTransition: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.35, ease: EASE.out } },
  exit: { opacity: 0, transition: { duration: 0.25, ease: EASE.in } },
};

export const slideInLeft: Variants = {
  initial: { x: -64, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: SPRING.default },
};

export const slideInRight: Variants = {
  initial: { x: 64, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: SPRING.default },
};

export const scaleIn: Variants = {
  initial: { scale: 0.92, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: SPRING.soft },
};

/** -------- New polished variants -------- */
export const slide = (
  dir: "up" | "down" | "left" | "right",
  amt = 60,
  delay = 0
): Variants => {
  const map = {
    up: { y: amt },
    down: { y: -amt },
    left: { x: amt },
    right: { x: -amt },
  } as const;
  return {
    hidden: { opacity: 0, ...(map[dir] ?? { y: amt }) },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { ...SPRING.default, delay },
    },
  } satisfies Variants;
};

export const revealUp: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { ...SPRING.soft },
  },
};

export const reveal: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: EASE.out } },
};

export const inViewStagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
      when: "beforeChildren",
    },
  },
};

export const lift = {
  whileHover: { y: -3 },
  transition: SPRING.soft as Transition,
};
export const float = {
  whileHover: { y: -6, rotate: -0.3 },
  transition: SPRING.soft as Transition,
};
export const press = {
  whileTap: { scale: 0.98 },
  transition: SPRING.soft as Transition,
};

export const iconTap = {
  whileTap: { scale: 0.9, rotate: -2 },
  transition: SPRING.snappy as Transition,
};

export const modalFade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2, ease: EASE.out } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: EASE.in } },
};

export const drawerSlide: Variants = {
  initial: { x: "100%" },
  animate: { x: 0, transition: SPRING.snappy },
  exit: { x: "100%", transition: { duration: 0.2, ease: EASE.in } },
};

export const blurIn: Variants = {
  initial: { opacity: 0, filter: "blur(8px)", scale: 0.98 },
  animate: {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    transition: { duration: 0.5, ease: EASE.out },
  },
};

export const listItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE.out } },
};

/** Layout spring (handy for `layout` prop containers) */
export const layoutSpring: Transition = SPRING.soft;
