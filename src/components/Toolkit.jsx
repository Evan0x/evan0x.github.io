import { skills } from '../data/site.js';
import { itemReveal, listReveal, m, useMotionPrefs } from '../motion/MotionProvider.jsx';
import { Section } from './Section.jsx';
import './Toolkit.css';

export function Toolkit() {
  const prefs = useMotionPrefs();

  return (
    <Section
      id="stack"
      index="04"
      kicker="Stack"
      title="Operating set."
      aside="The languages and services in use. Listed, not scored."
    >
      <m.div className="racks" {...listReveal(prefs)}>
        {skills.map((rack) => (
          <m.div className="rack" key={rack.index} {...itemReveal(prefs)}>
            <p className="rack-index">{rack.index}</p>
            <h3>{rack.title}</h3>
            <ul>
              {rack.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </m.div>
        ))}
      </m.div>
    </Section>
  );
}
