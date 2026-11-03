import { about } from '../data/site.js';
import { itemReveal, listReveal, m, revealProps, useMotionPrefs } from '../motion/MotionProvider.jsx';
import { Section } from './Section.jsx';
import './About.css';

export function About() {
  const prefs = useMotionPrefs();

  return (
    <Section
      id="notes"
      index="01"
      kicker="Field notes"
      title={
        <>
          Curious by default.
          <span className="title-quiet">Builder by choice.</span>
        </>
      }
      aside="Name, school, horizon, and the layers I want to work in."
    >
      <div className="dossier">
        <m.article className="dossier-id" {...revealProps(prefs)}>
          <p className="kicker">
            <span className="kicker-index">00</span>
            Core identity
          </p>
          <h3>{about.name}</h3>
          <p className="dossier-role">{about.role}</p>
          <p className="dossier-meta">{about.expected}</p>
        </m.article>
        <div>
          <p className="kicker">
            <span className="kicker-index">01</span>
            Interests
          </p>
          <m.ul className="interest-field" {...listReveal(prefs)}>
            {about.interests.map((item, index) => (
              <m.li key={item} {...itemReveal(prefs)}>
                {index > 0 ? <span className="interest-link" aria-hidden="true" /> : null}
                <span className="interest-node">
                  <span className="interest-orb" aria-hidden="true" />
                  <span className="interest-index">{String(index + 1).padStart(2, '0')}</span>
                  <span>{item}</span>
                </span>
              </m.li>
            ))}
          </m.ul>
        </div>
      </div>
    </Section>
  );
}
