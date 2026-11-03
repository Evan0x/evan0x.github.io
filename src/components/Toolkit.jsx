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
      aside="The languages and services in use. Listed, not scored."
    >
      <div className="racks">
        {skills.map((rack) => (
          <div className="rack" key={rack.index}>
            <p className="rack-index">{rack.index}</p>
            <h3>{rack.title}</h3>
            <ul>
              {rack.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
