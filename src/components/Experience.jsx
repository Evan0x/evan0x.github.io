import { education, experience } from '../data/site.js';
import { itemReveal, listReveal, m, revealProps, useMotionPrefs } from '../motion/MotionProvider.jsx';
import { Section } from './Section.jsx';
import './Experience.css';

export function Experience() {
  const prefs = useMotionPrefs();

  return (
    <Section
      id="record"
      index="03"
      kicker="Record"
      title="Time in the work."
      aside="One internship already finished. The degree is still underway."
    >
      <div className="entries">
        <m.article className="entry" id={experience.id} {...revealProps(prefs)}>
          <div className="entry-when">
            <p>{experience.when}</p>
            <p>{experience.place}</p>
          </div>
          <div>
            <h3>{experience.role}</h3>
            <p className="entry-org">{experience.org}</p>
            <p className="prose">{experience.summary}</p>
            <m.ul className="workstreams" {...listReveal(prefs)}>
              {experience.work.map((item) => (
                <m.li key={item.index} {...itemReveal(prefs)}>
                  <span>{item.index}</span>
                  <strong>{item.label}</strong>
                  <span>{item.text}</span>
                </m.li>
              ))}
            </m.ul>
            <a className="text-link" href={experience.href} target="_blank" rel="noreferrer">
              {experience.linkLabel} <span aria-hidden="true">↗</span>
            </a>
          </div>
        </m.article>
        <m.article className="entry" {...revealProps(prefs, 0.08)}>
          <div className="entry-when">
            <p>{education.when}</p>
            <p>{education.place}</p>
          </div>
          <div>
            <h3>{education.role}</h3>
            <p className="entry-org">{education.org}</p>
            <p className="prose">{education.summary}</p>
          </div>
        </m.article>
      </div>
    </Section>
  );
}
