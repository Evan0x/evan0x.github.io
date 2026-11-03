import { useId, useState } from 'react';
import { Architecture } from './Architecture.jsx';
import { projects } from '../data/site.js';
import { m, revealProps, useMotionPrefs } from '../motion/MotionProvider.jsx';
import { Section } from './Section.jsx';
import './Projects.css';

function Frame({ frame, width, height, featured = false }) {
  return (
    <figure className={featured ? 'lab-frame is-featured' : 'lab-frame'}>
      <img
        src={frame.src}
        alt={frame.alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
      />
      <figcaption>
        <span>{frame.caption}</span>
        <span>{frame.note}</span>
      </figcaption>
    </figure>
  );
}

function Pipeline({ steps }) {
  return (
    <ol className="lab-pipe">
      {steps.map((step, index) => (
        <li key={step.label}>
          <span>{step.label}</span>
          <small>{step.detail}</small>
          {index < steps.length - 1 ? <i aria-hidden="true" /> : null}
        </li>
      ))}
    </ol>
  );
}

function Bench({ project, showPipeline = true }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <>
      <div className="lab-actions">
        {project.links.map((link) => (
          <a key={link.label} className="text-link" href={link.href} target="_blank" rel="noreferrer">
            {link.label} <span aria-hidden="true">↗</span>
          </a>
        ))}
        <button
          type="button"
          className="lab-toggle"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? 'Close the bench' : 'Open the bench'}
        </button>
      </div>
      <div
          className={open ? 'lab-fold is-open' : 'lab-fold'}
          id={panelId}
          inert={open ? undefined : true}
        >
        <div className="lab-fold-inner">
          <div className={showPipeline ? 'lab-bench' : 'lab-bench lab-bench--single'}>
            {showPipeline ? (
              <div>
                <p className="kicker">
                  <span className="kicker-index">{project.number}</span>
                  Architecture
                </p>
                <Pipeline steps={project.pipeline} />
              </div>
            ) : null}
            <div>
              <p className="kicker">
                <span className="kicker-index">{project.number}</span>
                Decisions
              </p>
              <ul className="lab-decisions">
                {project.decisions.map((item) => (
                  <li key={item.title}>
                    <h4>{item.title}</h4>
                    <p className="prose">{item.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Tags({ stack }) {
  return (
    <ul className="tags">
      {stack.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function Copy({ project }) {
  return (
    <div className="lab-copy">
      <p className="kicker">
        <span className="kicker-index">{project.number}</span>
        {project.category}
      </p>
      <h3>
        <a href={project.primary.href} target="_blank" rel="noreferrer">
          {project.name}
        </a>
      </h3>
      <p className="prose">{project.description}</p>
      <p className="lab-problem">{project.problem}</p>
      <Tags stack={project.stack} />
    </div>
  );
}

function BayShell({ project, className, children }) {
  const prefs = useMotionPrefs();
  return (
    <m.article
      className={className}
      id={project.id}
      {...revealProps(prefs)}
      whileHover={prefs.lift ? { y: -5, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } } : undefined}
    >
      {children}
    </m.article>
  );
}

function PrimaryBay({ project }) {
  const [hero, ...rest] = project.frames;

  return (
    <BayShell project={project} className="bay bay--primary">
      <Copy project={project} />
      <div className="lab-stage">
        <Frame frame={hero} width={project.width} height={project.height} featured />
        <div className="lab-strip">
          {rest.map((frame) => (
            <Frame key={frame.src} frame={frame} width={project.width} height={project.height} />
          ))}
        </div>
      </div>
      <Architecture />
      <Bench project={project} showPipeline={false} />
    </BayShell>
  );
}

function SideBay({ project }) {
  return (
    <BayShell project={project} className={`bay bay--${project.layout}`}>
      <Frame
        frame={project.frames[0]}
        width={project.width}
        height={project.height}
        featured
      />
      <Copy project={project} />
      <Bench project={project} />
    </BayShell>
  );
}

export function Projects() {
  const [featured, ...rest] = projects;

  return (
    <Section
      id="work"
      index="02"
      kicker="Laboratory"
      title="Selected systems."
      aside="Three environments. Each one built around a constraint someone actually has."
    >
      <PrimaryBay project={featured} />
      <div className="lab-pair">
        {rest.map((project) => (
          <SideBay key={project.id} project={project} />
        ))}
      </div>
    </Section>
  );
}
