import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { m, useMotionPrefs } from '../motion/MotionProvider.jsx';
import { autocompleteCommand, runTerminalCommand } from '../systems/actions.js';
import { useSystems } from '../systems/SystemsContext.jsx';
import './Terminal.css';

const WELCOME = [
  'evan / systems  ·  terminal',
  'Type help to list commands.',
].join('\n');

function Line({ entry }) {
  if (entry.kind === 'in') {
    return (
      <p className="term-line term-line--in">
        <span className="term-prompt">guest@yibole:~$</span>
        <span>{entry.text}</span>
      </p>
    );
  }
  return <pre className="term-line">{entry.text}</pre>;
}

export function Terminal() {
  const prefs = useMotionPrefs();
  const { terminalOpen, closeTerminal } = useSystems();
  const labelId = useId();
  const inputRef = useRef(null);
  const scrollerRef = useRef(null);
  const historyRef = useRef([]);
  const historyCursor = useRef(-1);
  const [banner, setBanner] = useState('');
  const [ready, setReady] = useState(false);
  const [value, setValue] = useState('');
  const [hint, setHint] = useState('');
  const [log, setLog] = useState([]);

  useEffect(() => {
    if (!terminalOpen) return undefined;
    historyCursor.current = -1;
    setValue('');
    setHint('');
    setLog([]);
    setReady(false);

    if (!prefs.reveal) {
      setBanner(WELCOME);
      setReady(true);
      return undefined;
    }

    setBanner('');
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setBanner(WELCOME.slice(0, index));
      if (index >= WELCOME.length) {
        window.clearInterval(timer);
        setReady(true);
      }
    }, 16);
    return () => window.clearInterval(timer);
  }, [terminalOpen, prefs.reveal]);

  useEffect(() => {
    if (!terminalOpen || !ready) return undefined;
    const id = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(id);
  }, [terminalOpen, ready]);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight });
  }, [log, banner, value]);

  function submit(raw) {
    const command = raw.trim();
    if (command) {
      historyRef.current.push(command);
    }
    historyCursor.current = -1;
    setHint('');

    const result = runTerminalCommand(raw);
    if (result.kind === 'exit') {
      closeTerminal();
      return;
    }
    if (result.kind === 'clear') {
      setLog([]);
      setBanner('');
      setValue('');
      return;
    }
    if (result.kind === 'empty') {
      setLog((entries) => [...entries, { kind: 'in', text: '' }]);
      setValue('');
      return;
    }

    setLog((entries) => [
      ...entries,
      { kind: 'in', text: raw },
      { kind: 'out', text: result.lines.join('\n') },
    ]);
    setValue('');
  }

  function onKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      submit(value);
      return;
    }

    if (event.key === 'Tab') {
      event.preventDefault();
      const match = autocompleteCommand(value);
      if (typeof match === 'string') {
        setValue(match);
        setHint('');
      } else if (Array.isArray(match)) {
        setHint(match.join('  '));
      }
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      const history = historyRef.current;
      if (!history.length) return;
      const next = historyCursor.current < 0 ? history.length - 1 : Math.max(historyCursor.current - 1, 0);
      historyCursor.current = next;
      setValue(history[next]);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const history = historyRef.current;
      if (historyCursor.current < 0) return;
      const next = historyCursor.current + 1;
      if (next >= history.length) {
        historyCursor.current = -1;
        setValue('');
        return;
      }
      historyCursor.current = next;
      setValue(history[next]);
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
          initial: { opacity: 0, y: 16, scale: 0.98 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 10, scale: 0.98 },
          transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
        },
      }
    : {
        scrim: { initial: false, animate: { opacity: 1 }, exit: { opacity: 1 } },
        panel: { initial: false, animate: { opacity: 1 }, exit: { opacity: 1 } },
      };

  return (
    <AnimatePresence>
      {terminalOpen ? (
        <m.div
          className="term-scrim"
          {...motion.scrim}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeTerminal();
          }}
        >
          <m.section className="term" aria-labelledby={labelId} {...motion.panel}>
            <header className="term-bar">
              <p className="kicker" id={labelId}>
                <span className="kicker-index">$</span>
                guest@yibole
              </p>
              <button type="button" className="term-close" onClick={closeTerminal}>
                Close
              </button>
            </header>
            <div
              className="term-body"
              ref={scrollerRef}
              onClick={() => inputRef.current?.focus()}
            >
              {banner ? <pre className="term-banner">{banner}</pre> : null}
              {log.map((entry, index) => (
                <Line key={`${entry.kind}-${index}`} entry={entry} />
              ))}
              {ready ? (
                <p className="term-line term-line--in">
                  <label className="term-prompt" htmlFor="term-input">
                    guest@yibole:~$
                  </label>
                  <input
                    id="term-input"
                    ref={inputRef}
                    className="term-input"
                    type="text"
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    onKeyDown={onKeyDown}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck="false"
                    enterKeyHint="go"
                    aria-label="Terminal command"
                  />
                </p>
              ) : null}
              {hint ? <p className="term-hint">{hint}</p> : null}
            </div>
          </m.section>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
