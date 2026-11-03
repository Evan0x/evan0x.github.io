import { useEffect, useState } from 'react';
import { navigation } from '../data/site.js';
import { useMotionPrefs } from '../motion/MotionProvider.jsx';
import { onHashClick } from '../motion/scroll.js';
import './Navigation.css';

const SECTION_IDS = navigation.map((item) => item.id);

export function Navigation() {
  const prefs = useMotionPrefs();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const primary = navigation.filter((item) => !item.emphasis);
  const channel = navigation.find((item) => item.emphasis);

  useEffect(() => {
    const nodes = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);
    let frame = 0;

    function measure() {
      frame = 0;
      const mark = window.innerHeight * 0.32;
      let current = '';
      for (const node of nodes) {
        if (node.getBoundingClientRect().top <= mark) current = node.id;
      }
      setActive((prev) => (prev === current ? prev : current));
    }

    function onScroll() {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    }

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    function onKey(event) {
      if (event.key === 'Escape') setOpen(false);
    }

    function onHash() {
      setOpen(false);
    }

    const desktop = window.matchMedia('(min-width: 861px)');
    function onDesktop() {
      if (desktop.matches) setOpen(false);
    }

    window.addEventListener('keydown', onKey);
    window.addEventListener('hashchange', onHash);
    desktop.addEventListener('change', onDesktop);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('hashchange', onHash);
      desktop.removeEventListener('change', onDesktop);
    };
  }, []);

  function close() {
    setOpen(false);
  }

  function go(event, href) {
    onHashClick(event, href, prefs.reduced, close);
  }

  return (
    <header className={open ? 'nav is-open' : 'nav'}>
      <div className="wrap nav-bar">
        <a className="wordmark" href="#index" onClick={(event) => go(event, '#index')}>
          Evan <span>/ Systems</span>
        </a>
        <nav className="nav-links" id="primary-navigation" aria-label="Primary">
          {primary.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={active === item.id ? 'location' : undefined}
              onClick={(event) => go(event, `#${item.id}`)}
            >
              <span>{item.index}</span>
              {item.label}
            </a>
          ))}
          <a
            className="nav-channel nav-channel--menu"
            href={`#${channel.id}`}
            aria-current={active === channel.id ? 'location' : undefined}
            onClick={(event) => go(event, `#${channel.id}`)}
          >
            <span>{channel.index}</span>
            {channel.label}
          </a>
        </nav>
        <a
          className="nav-channel nav-channel--bar"
          href={`#${channel.id}`}
          aria-current={active === channel.id ? 'location' : undefined}
          onClick={(event) => go(event, `#${channel.id}`)}
        >
          {channel.label}
        </a>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
      {open ? (
        <button type="button" className="nav-scrim" aria-label="Close menu" onClick={close} />
      ) : null}
    </header>
  );
}
