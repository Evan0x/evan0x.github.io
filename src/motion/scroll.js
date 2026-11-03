import { isStudyHash } from '../hooks/useHashView.js';

export function scrollToHash(hash, { reduced = false } = {}) {
  if (!hash || hash === '#') return;
  if (isStudyHash(hash)) {
    if (window.location.hash !== hash) window.location.hash = hash;
    return;
  }

  const id = hash.startsWith('#') ? hash.slice(1) : hash;
  const node = document.getElementById(id);
  if (!node) {
    if (window.location.hash !== `#${id}`) window.location.hash = `#${id}`;
    return;
  }

  const nav = document.querySelector('.nav');
  const offset = (nav?.getBoundingClientRect().height ?? 68) + 8;
  const top = Math.max(0, node.getBoundingClientRect().top + window.scrollY - offset);

  window.scrollTo({
    top,
    behavior: reduced ? 'auto' : 'smooth',
  });

  if (window.location.hash !== `#${id}`) {
    history.replaceState(null, '', `#${id}`);
  }
}

export function onHashClick(event, href, reduced, after) {
  if (!href?.startsWith('#')) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button) return;
  event.preventDefault();
  after?.();
  if (isStudyHash(href) || isStudyHash(window.location.hash)) {
    window.location.hash = href;
    return;
  }
  requestAnimationFrame(() => scrollToHash(href, { reduced }));
}
