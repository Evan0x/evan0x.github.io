import { education, experience } from '../data/site.js';
import { Section } from './Section.jsx';
import './Experience.css';

function Entry({ item, children }) {
  return (
    <article className="entry" id={item.id}>
      <div className="entry-when">
        <p>{item.when}</p>
        <p>{item.place}</p>
      </div>
      <div>
        <h3>{item.role}</h3>
        <p className="entry-org">{item.org}</p>
        {children}
      </div>
    </article>
  );
}

export function Experience() {
  return (
    <Section
      id="record"
      index="03"
      kicker="Record"
      title="Time in the work."
      aside="An internship already finished, and a degree still underway."
    >
      <div className="entries">
        <Entry item={experience}>
          <p className="prose">{experience.summary}</p>
          <ul className="entry-points">
            {experience.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <a className="text-link" href={experience.href} target="_blank" rel="noreferrer">
            {experience.linkLabel} <span aria-hidden="true">↗</span>
          </a>
        </Entry>
        <Entry item={education}>
          <p className="prose">{education.summary}</p>
        </Entry>
      </div>
    </Section>
  );
}
