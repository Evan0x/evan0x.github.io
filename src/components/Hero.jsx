import { profile } from '../data/site.js';
import { m, useMotionPrefs } from '../motion/MotionProvider.jsx';
import { useSystems } from '../systems/SystemsContext.jsx';
import { Constellation } from './Constellation.jsx';
import './Hero.css';

export function Hero() {
  const prefs = useMotionPrefs();
  const { openPalette, openTerminal, shortcut } = useSystems();
  const enter = prefs.reveal
    ? {
        initial: { opacity: 0, y: prefs.mobile ? 8 : 14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: prefs.mobile ? 0.35 : 0.55, ease: [0.22, 1, 0.36, 1] },
      }
    : { initial: false };

  return (
    <section className="hero" id="index" aria-labelledby="index-title">
      <div className="wrap hero-frame">
        <m.header className="hero-mast" {...enter}>
          <p className="kicker">
            <span className="status-dot" />
            Enter · 001
          </p>
          <h1 id="index-title">
            Evan
            <span className="hero-system">/ Systems</span>
          </h1>
          <p className="hero-sub">{profile.subtitle}</p>
          <div className="hero-identity">
            <p className="hero-name">{profile.name}</p>
            <p>{profile.role}</p>
            <p>{profile.focus}</p>
          </div>
          <div className="hero-launch">
            {prefs.mobile ? null : (
              <button type="button" className="hero-launch-btn" onClick={openTerminal}>
                Open terminal
              </button>
            )}
            <button type="button" className="hero-launch-btn" onClick={openPalette}>
              {prefs.mobile ? 'Jump to a section' : <>Command <span>{shortcut}</span></>}
            </button>
          </div>
        </m.header>
        <Constellation />
        <p className="hero-hint">Select a node to enter a system</p>
      </div>
    </section>
  );
}
