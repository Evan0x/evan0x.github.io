import { skills } from '../data/site.js';
import { Section } from './Section.jsx';
import './Toolkit.css';

export function Toolkit() {
  return (
    <Section
      id="stack"
      index="04"
      kicker="Stack"
      title="Operating set."
      aside="Languages, services, and the tools around the work."
    >
      <div className="stack">
        {skills.map(([index, title, detail]) => (
          <div className="stack-row" key={index}>
            <p>{index}</p>
            <h3>{title}</h3>
            <p>{detail}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
