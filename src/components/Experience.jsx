import { education, experience } from '../data/site.js';
import { Section } from './Section.jsx';
import './Experience.css';

export function Experience() {
  return (
    <Section
      id="record"
      index="03"
      kicker="Record"
      title="Time in the work."
      aside="One internship already finished. The degree is still underway."
    >
      <div className="entries">
        <article className="entry" id={experience.id}>
          <div className="entry-when">
            <p>{experience.when}</p>
            <p>{experience.place}</p>
          </div>
          <div>
            <h3>{experience.role}</h3>
            <p className="entry-org">{experience.org}</p>
            <p className="prose">{experience.summary}</p>
            <ul className="workstreams">
              {experience.work.map((item) => (
                <li key={item.index}>
                  <span>{item.index}</span>
                  <strong>{item.label}</strong>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
            <a className="text-link" href={experience.href} target="_blank" rel="noreferrer">
              {experience.linkLabel} <span aria-hidden="true">↗</span>
            </a>
          </div>
        </article>
        <article className="entry">
          <div className="entry-when">
            <p>{education.when}</p>
            <p>{education.place}</p>
          </div>
          <div>
            <h3>{education.role}</h3>
            <p className="entry-org">{education.org}</p>
            <p className="prose">{education.summary}</p>
          </div>
        </article>
      </div>
    </Section>
  );
}
