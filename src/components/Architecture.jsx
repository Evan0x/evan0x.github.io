import { useEffect, useId, useRef, useState } from 'react';
import { syllacalArchitecture } from '../data/syllacalArchitecture.js';
import './Architecture.css';

export function Architecture() {
  const [activeId, setActiveId] = useState(syllacalArchitecture[0].id);
  const [fromKeys, setFromKeys] = useState(false);
  const labelId = useId();
  const panelId = useId();
  const listRef = useRef(null);
  const panelRef = useRef(null);
  const activeIndex = syllacalArchitecture.findIndex((node) => node.id === activeId);
  const active = syllacalArchitecture[activeIndex];
  const total = String(syllacalArchitecture.length).padStart(2, '0');

  useEffect(() => {
    if (!fromKeys || !listRef.current) return;
    const button = listRef.current.querySelector(`[data-node="${activeId}"]`);
    button?.focus();
    setFromKeys(false);
  }, [activeId, fromKeys]);

  function select(id, { keyboard = false } = {}) {
    setFromKeys(keyboard);
    setActiveId(id);
    if (!keyboard && window.matchMedia('(max-width: 860px)').matches) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      panelRef.current?.scrollIntoView({
        block: 'nearest',
        behavior: reduce ? 'auto' : 'smooth',
      });
    }
  }

  function onKey(event) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const next = event.key === 'ArrowDown'
      ? Math.min(activeIndex + 1, syllacalArchitecture.length - 1)
      : Math.max(activeIndex - 1, 0);
    select(syllacalArchitecture[next].id, { keyboard: true });
  }

  return (
    <div className="arch">
      <p className="kicker" id={labelId}>
        <span className="kicker-index">01</span>
        Path through the system
      </p>
      <p className="arch-lede">
        A PDF goes in. A calendar file comes out. Click a stage to see what that step actually does.
      </p>
      <div className="arch-layout">
        <ol className="arch-flow" aria-labelledby={labelId} ref={listRef}>
          {syllacalArchitecture.map((node, index) => {
            const selected = node.id === activeId;
            const reached = index <= activeIndex;
            const step = String(index + 1).padStart(2, '0');
            return (
              <li key={node.id} className={reached ? 'arch-step is-reached' : 'arch-step'}>
                {index > 0 ? (
                  <span className={index <= activeIndex ? 'arch-link is-lit' : 'arch-link'} aria-hidden="true">
                    <i />
                  </span>
                ) : null}
                <button
                  type="button"
                  className={selected ? 'arch-node is-active' : 'arch-node'}
                  data-node={node.id}
                  aria-pressed={selected}
                  aria-controls={panelId}
                  aria-label={`${node.label}, stage ${step} of ${total}`}
                  onClick={() => select(node.id)}
                  onKeyDown={onKey}
                >
                  <span className="arch-orb" aria-hidden="true" />
                  <span className="arch-index">{step}</span>
                  <span className="arch-label">{node.label}</span>
                </button>
              </li>
            );
          })}
        </ol>
        <aside className="arch-panel" id={panelId} aria-live="polite" ref={panelRef}>
          <p className="kicker">
            <span className="kicker-index">{String(activeIndex + 1).padStart(2, '0')}</span>
            {active.label}
          </p>
          <p className="arch-plain">{active.plain}</p>
          <dl className="arch-facts">
            <div>
              <dt>Responsibility</dt>
              <dd>{active.responsibility}</dd>
            </div>
            <div>
              <dt>Technology</dt>
              <dd>{active.technology}</dd>
            </div>
            <div>
              <dt>Engineering decision</dt>
              <dd>{active.decision}</dd>
            </div>
          </dl>
          {active.snippet ? (
            <pre className="arch-code">
              <code>{active.snippet}</code>
            </pre>
          ) : null}
          <a className="text-link" href={active.source.href} target="_blank" rel="noreferrer">
            {active.source.file} <span aria-hidden="true">↗</span>
          </a>
        </aside>
      </div>
    </div>
  );
}
