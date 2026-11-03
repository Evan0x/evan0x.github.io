import { useId, useState } from 'react';
import { m, useMotionPrefs } from '../../motion/MotionProvider.jsx';

export function CodeSnippet({ file, href, caption, code, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <article className={open ? 'study-snippet is-open' : 'study-snippet'}>
      <div className="study-snippet-bar">
        <button
          type="button"
          className="study-snippet-toggle"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          <span>{open ? 'Hide' : 'Show'} snippet</span>
          <strong>{file}</strong>
        </button>
        {href ? (
          <a className="text-link" href={href} target="_blank" rel="noreferrer">
            GitHub <span aria-hidden="true">↗</span>
          </a>
        ) : null}
      </div>
      {caption ? <p className="study-caption">{caption}</p> : null}
      <div className={open ? 'lab-fold is-open' : 'lab-fold'} id={panelId} inert={open ? undefined : true}>
        <div className="lab-fold-inner">
          <pre className="study-code">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </article>
  );
}

export function ApiExplorer({ examples }) {
  const [activeId, setActiveId] = useState(examples[0].id);
  const prefs = useMotionPrefs();
  const active = examples.find((item) => item.id === activeId) ?? examples[0];

  return (
    <div className="study-api">
      <div className="study-api-tabs" role="tablist" aria-label="Request examples">
        {examples.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === active.id}
            className={item.id === active.id ? 'is-active' : undefined}
            onClick={() => setActiveId(item.id)}
          >
            {item.title}
          </button>
        ))}
      </div>
      <m.div
        key={active.id}
        className="study-api-panel"
        initial={prefs.reveal ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: prefs.reduced ? 0 : 0.2 }}
      >
        <p className="study-api-meta">
          <span>{active.method}</span>
          <code>{active.path}</code>
          <span>{active.status}</span>
        </p>
        <p className="prose">{active.note}</p>
        <div className="study-api-grid">
          <figure>
            <figcaption>Request</figcaption>
            <pre className="study-code">
              <code>{active.request}</code>
            </pre>
          </figure>
          <figure>
            <figcaption>Response</figcaption>
            <pre className="study-code">
              <code>{active.response}</code>
            </pre>
          </figure>
        </div>
        {active.source ? (
          <a className="text-link" href={active.source.href} target="_blank" rel="noreferrer">
            {active.source.file} <span aria-hidden="true">↗</span>
          </a>
        ) : null}
      </m.div>
    </div>
  );
}

export function DataFlow({ steps, lede }) {
  const [activeId, setActiveId] = useState(steps[0].id);
  const activeIndex = steps.findIndex((step) => step.id === activeId);
  const active = steps[activeIndex] ?? steps[0];

  return (
    <div className="study-flow">
      {lede ? <p className="prose">{lede}</p> : null}
      <ol className="study-flow-track">
        {steps.map((step, index) => {
          const selected = step.id === activeId;
          const reached = index <= activeIndex;
          return (
            <li key={step.id} className={reached ? 'is-reached' : undefined}>
              <button
                type="button"
                className={selected ? 'is-active' : undefined}
                aria-pressed={selected}
                onClick={() => setActiveId(step.id)}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                {step.label}
              </button>
              {index < steps.length - 1 ? <i aria-hidden="true" /> : null}
            </li>
          );
        })}
      </ol>
      <p className="study-flow-detail">
        <strong>{active.label}.</strong> {active.detail}
      </p>
    </div>
  );
}

export function BeforeAfter({ comparison }) {
  if (!comparison) return null;

  return (
    <div className="study-compare">
      <p className="kicker">
        <span className="kicker-index">Δ</span>
        {comparison.title}
      </p>
      <p className="study-caption">{comparison.evidence}</p>
      <div className="study-compare-grid">
        <article>
          <p className="kicker">
            <span className="kicker-index">A</span>
            {comparison.before.label}
          </p>
          <p className="prose">{comparison.before.text}</p>
        </article>
        <article>
          <p className="kicker">
            <span className="kicker-index">B</span>
            {comparison.after.label}
          </p>
          <p className="prose">{comparison.after.text}</p>
        </article>
      </div>
    </div>
  );
}
