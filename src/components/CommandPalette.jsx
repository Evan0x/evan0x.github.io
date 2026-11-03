import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { m, useMotionPrefs } from '../motion/MotionProvider.jsx';
import { filterPaletteCommands } from '../systems/actions.js';
import { useSystems } from '../systems/SystemsContext.jsx';
import './CommandPalette.css';

export function CommandPalette() {
  const prefs = useMotionPrefs();
  const { paletteOpen, closePalette, shortcut } = useSystems();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [notice, setNotice] = useState('');
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const runId = useRef(0);
  const results = useMemo(() => filterPaletteCommands(query), [query]);

  useEffect(() => {
    runId.current += 1;
    if (!paletteOpen) {
      setQuery('');
      setActive(0);
      setNotice('');
      return undefined;
    }
    setQuery('');
    setActive(0);
    setNotice('');
    const id = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(id);
  }, [paletteOpen]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    const node = listRef.current?.querySelector('[data-active="true"]');
    node?.scrollIntoView({ block: 'nearest' });
  }, [active, results]);

  async function execute(item) {
    if (!item) return;
    const id = ++runId.current;
    try {
      const task = Promise.resolve(item.run({ reduced: prefs.reduced }));
      if (item.id === 'email') {
        setNotice(`Copied ${item.hint}`);
        await Promise.race([
          task,
          new Promise((_, reject) => window.setTimeout(() => reject(new Error('copy-timeout')), 900)),
        ]);
        return;
      }
      await task;
      if (runId.current === id) closePalette();
    } catch (error) {
      if (runId.current !== id) return;
      if (item.id === 'email' && error?.message === 'copy-timeout') return;
      setNotice(item.id === 'email' ? 'Could not copy email from this browser.' : 'That action could not be completed.');
    }
  }

  function onKeyDown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((index) => Math.min(index + 1, Math.max(results.length - 1, 0)));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActive(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActive(Math.max(results.length - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      execute(results[active]);
    }
  }

  const motion = prefs.reveal
    ? {
        scrim: {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.18 },
        },
        panel: {
          initial: { opacity: 0, y: 12, scale: 0.98 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 8, scale: 0.98 },
          transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
        },
      }
    : {
        scrim: { initial: false, animate: { opacity: 1 }, exit: { opacity: 1 } },
        panel: { initial: false, animate: { opacity: 1 }, exit: { opacity: 1 } },
      };

  return (
    <AnimatePresence>
      {paletteOpen ? (
        <m.div
          className="palette-scrim"
          {...motion.scrim}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closePalette();
          }}
        >
          <m.div
            className="palette"
            role="dialog"
            aria-modal="true"
            aria-labelledby="palette-title"
            {...motion.panel}
          >
            <p className="kicker" id="palette-title">
              <span className="kicker-index">{shortcut}</span>
              Command center
            </p>
            <input
              ref={inputRef}
              className="palette-input"
              type="text"
              value={query}
              placeholder="Search commands"
              aria-label="Search commands"
              aria-controls="palette-results"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck="false"
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={onKeyDown}
            />
            <ul className="palette-list" id="palette-results" role="listbox" ref={listRef}>
              {results.length === 0 ? (
                <li className="palette-empty">No matching command.</li>
              ) : (
                results.map((item, index) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={index === active ? 'palette-item is-active' : 'palette-item'}
                      role="option"
                      aria-selected={index === active}
                      data-active={index === active ? 'true' : undefined}
                      onMouseEnter={() => setActive(index)}
                      onClick={() => execute(item)}
                    >
                      <span className="palette-group">{item.group}</span>
                      <span className="palette-label">{item.label}</span>
                      <span className="palette-hint">{item.hint}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
            <p className="palette-foot" aria-live="polite">
              {notice || '↑↓ to move · Enter to run · Esc to close'}
            </p>
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
