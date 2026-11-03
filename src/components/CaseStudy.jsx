import { useEffect } from 'react';
import { Architecture } from './Architecture.jsx';
import { caseStudies } from '../data/caseStudies.js';
import { m, revealProps, useMotionPrefs } from '../motion/MotionProvider.jsx';
import { onHashClick } from '../motion/scroll.js';
import { ApiExplorer, BeforeAfter, CodeSnippet, DataFlow } from './study/StudyWidgets.jsx';
import './CaseStudy.css';

export function CaseStudy({ study }) {
  const prefs = useMotionPrefs();

  useEffect(() => {
    const previous = document.title;
    document.title = `${study.name} · Case study · Evan Yibole`;
    window.scrollTo(0, 0);
    return () => {
      document.title = previous;
    };
  }, [study.name]);

  function back(event) {
    onHashClick(event, '#work', prefs.reduced);
  }

  return (
    <article className="study" id="study">
      <div className="wrap">
        <m.header className="study-hero" {...revealProps(prefs)}>
          <a className="text-link" href="#work" onClick={back}>
            ← Laboratory
          </a>
          <p className="kicker">
            <span className="kicker-index">{study.number}</span>
            {study.kicker}
          </p>
          <h1>{study.name}</h1>
          <p className="study-category">{study.category}</p>
          <p className="prose">{study.stage}</p>
          <ul className="tags">
            {study.stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="study-hero-links">
            {study.links.map((link) => (
              <a key={link.href} className="text-link" href={link.href} target="_blank" rel="noreferrer">
                {link.label} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </m.header>

        <div className="study-layout">
          <nav className="study-toc" aria-label="Case study sections">
            <p className="kicker">
              <span className="kicker-index">{study.number}</span>
              Contents
            </p>
            <ol>
              {study.sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#study/${study.id}`}
                    onClick={(event) => {
                      event.preventDefault();
                      document.getElementById(section.id)?.scrollIntoView({
                        block: 'start',
                        behavior: prefs.reduced ? 'auto' : 'smooth',
                      });
                    }}
                  >
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="study-body">
            {study.sections.map((section) => (
              <StudySection key={section.id} study={study} section={section} prefs={prefs} />
            ))}

            <m.nav className="study-next" aria-label="Other case studies" {...revealProps(prefs)}>
              <p className="kicker">
                <span className="kicker-index">→</span>
                Other systems
              </p>
              <ul>
                {caseStudies
                  .filter((item) => item.id !== study.id)
                  .map((item) => (
                    <li key={item.id}>
                      <a href={`#study/${item.id}`}>
                        <span>{item.number}</span>
                        {item.name}
                      </a>
                    </li>
                  ))}
              </ul>
            </m.nav>
          </div>
        </div>
      </div>
    </article>
  );
}

export function MissingStudy({ id }) {
  const prefs = useMotionPrefs();

  return (
    <article className="study" id="study">
      <div className="wrap">
        <m.header className="study-hero" {...revealProps(prefs)}>
          <a className="text-link" href="#work" onClick={(event) => onHashClick(event, '#work', prefs.reduced)}>
            ← Laboratory
          </a>
          <h1>No case study for {id}.</h1>
          <p className="prose">That hash does not match SyllaCal, Avelamed, AveLoop, or Hangman.</p>
        </m.header>
      </div>
    </article>
  );
}

function StudySection({ study, section, prefs }) {
  return (
    <m.section className="study-block" id={section.id} {...revealProps(prefs)}>
      <p className="kicker">
        <span className="kicker-index">{study.number}</span>
        {section.title}
      </p>
      {section.body?.map((paragraph) => (
        <p key={paragraph} className="prose">
          {paragraph}
        </p>
      ))}
      {section.items ? (
        <ul className="study-list">
          {section.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {section.id === 'architecture' && study.architecture ? (
        <Architecture
          nodes={study.architecture.nodes}
          kicker={study.architecture.kicker}
          index={study.number}
          lede={study.architecture.lede}
          embedded
        />
      ) : null}
      {section.id === 'api' && study.apis ? <ApiExplorer examples={study.apis} /> : null}
      {section.id === 'pipeline' && study.flow ? <DataFlow steps={study.flow.steps} lede={study.flow.lede} /> : null}
      {section.id === 'pipeline' && study.snippets?.length ? (
        <div className="study-snippet-list">
          {study.snippets.map((snippet, index) => (
            <CodeSnippet key={snippet.id} {...snippet} defaultOpen={index === 0} />
          ))}
        </div>
      ) : null}
      {section.id === 'decisions' && study.beforeAfter ? <BeforeAfter comparison={study.beforeAfter} /> : null}
    </m.section>
  );
}
