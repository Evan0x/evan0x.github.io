export function scrollToHash(hash, { reduced = false } = {}) {
  if (!hash || hash === '#') return;
  const id = hash.startsWith('#') ? hash.slice(1) : hash;
  const node = document.getElementById(id);
  if (!node) return;

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
  requestAnimationFrame(() => scrollToHash(href, { reduced }));
}
