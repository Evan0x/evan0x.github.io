import { useEffect, useState } from 'react';

export function parseHash(hash = typeof window === 'undefined' ? '' : window.location.hash) {
  const value = String(hash || '').replace(/^#/, '');
  const match = /^study\/([a-z0-9-]+)/i.exec(value);
  if (match) return { kind: 'study', id: match[1].toLowerCase() };
  return { kind: 'home' };
}

export function isStudyHash(hash) {
  return parseHash(hash).kind === 'study';
}

export function useHashView() {
  const [view, setView] = useState(() => parseHash());

  useEffect(() => {
    function sync() {
      setView(parseHash());
    }

    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  return view;
}
