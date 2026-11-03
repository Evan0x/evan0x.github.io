import { profile } from '../data/site.js';
import { Constellation } from './Constellation.jsx';
import './Hero.css';

export function Hero() {
  return (
    <section className="hero" id="index" aria-labelledby="index-title">
      <div className="wrap hero-frame">
        <header className="hero-mast">
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
        </header>
        <Constellation />
        <p className="hero-hint">Select a node to enter a system</p>
      </div>
    </section>
  );
}
