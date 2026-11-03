import { m, revealProps, useMotionPrefs } from '../motion/MotionProvider.jsx';
import './Section.css';

export function Section({ id, index, kicker, title, aside, children }) {
  const prefs = useMotionPrefs();

  return (
    <section className="section" id={id} aria-labelledby={`${id}-title`}>
      <div className="wrap">
        <m.header className="section-head" {...revealProps(prefs)}>
          <div>
            <p className="kicker">
              <span className="kicker-index">{index}</span>
              {kicker}
            </p>
            <h2 id={`${id}-title`}>{title}</h2>
          </div>
          {aside ? <p className="section-aside">{aside}</p> : null}
        </m.header>
        {children}
      </div>
    </section>
  );
}
