import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion';

const MotionPrefs = createContext({
  reduced: false,
  hover: false,
  mobile: false,
  reveal: true,
  lift: false,
  drift: false,
});

export function MotionProvider({ children }) {
  const reduced = Boolean(useReducedMotion());
  const [hover, setHover] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const narrow = window.matchMedia('(max-width: 760px)');
    const sync = () => {
      setHover(fine.matches);
      setMobile(narrow.matches);
    };
    sync();
    fine.addEventListener('change', sync);
    narrow.addEventListener('change', sync);
    return () => {
      fine.removeEventListener('change', sync);
      narrow.removeEventListener('change', sync);
    };
  }, []);

  const value = useMemo(
    () => ({
      reduced,
      hover,
      mobile,
      reveal: !reduced,
      lift: !reduced && hover && !mobile,
      drift: !reduced && !mobile,
    }),
    [reduced, hover, mobile]
  );

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionPrefs.Provider value={value}>{children}</MotionPrefs.Provider>
    </LazyMotion>
  );
}

export function useMotionPrefs() {
  return useContext(MotionPrefs);
}

const ease = [0.22, 1, 0.36, 1];

export function revealProps(prefs, delay = 0) {
  if (!prefs.reveal) return { initial: false };
  return {
    initial: { opacity: 0, y: prefs.mobile ? 8 : 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: {
      duration: prefs.mobile ? 0.32 : 0.5,
      ease,
      delay: prefs.mobile ? 0 : delay,
    },
  };
}

export function listReveal(prefs) {
  if (!prefs.reveal) return { initial: false };
  return {
    initial: 'hidden',
    whileInView: 'show',
    viewport: { once: true, amount: 0.18 },
    variants: {
      hidden: {},
      show: {
        transition: {
          staggerChildren: prefs.mobile ? 0.04 : 0.07,
        },
      },
    },
  };
}

export function itemReveal(prefs) {
  if (!prefs.reveal) {
    return { variants: { hidden: { opacity: 1 }, show: { opacity: 1 } } };
  }
  return {
    variants: {
      hidden: { opacity: 0, y: prefs.mobile ? 6 : 12 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: prefs.mobile ? 0.28 : 0.42, ease },
      },
    },
  };
}

export { m, ease };
