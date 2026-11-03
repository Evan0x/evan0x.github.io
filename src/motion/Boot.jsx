import { useEffect } from 'react';
import { m, useMotionPrefs } from './MotionProvider.jsx';
import { scrollToHash } from './scroll.js';

export function Boot({ children }) {
  const prefs = useMotionPrefs();

  useEffect(() => {
    const id = window.location.hash;
    if (!id || id.startsWith('#study/')) return;
    const timer = window.setTimeout(() => {
      scrollToHash(id, { reduced: prefs.reduced });
    }, 40);
    return () => window.clearTimeout(timer);
  }, [prefs.reduced]);

  return (
    <m.div
      initial={prefs.reveal ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: prefs.reveal ? 0.42 : 0, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}
