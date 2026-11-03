import React from 'react';
import { ProfilePortrait } from './components/ProfilePortrait.jsx';
import { Projects } from './components/Projects.jsx';

const skills = [
  ['01', 'Languages', 'Java · Python · JavaScript · TypeScript · SQL'],
  ['02', 'Backend', 'Spring Boot · Node.js · Express · REST APIs'],
  ['03', 'Frontend', 'React · HTML · CSS'],
  ['04', 'Data & AI', 'PostgreSQL · Supabase · pgvector · Pandas'],
  ['05', 'Cloud & Tools', 'AWS · Docker · Git · GitHub']
];

function Arrow({ diagonal = false }) {
  return <span aria-hidden="true">{diagonal ? '↗' : '→'}</span>;
}

function App() {
  return (
    <div className="site-shell">
      <div className="noise" aria-hidden="true" />
      <header className="nav wrap">
        <a className="wordmark" href="#home" aria-label="Evan Yibole home">EY<span>.</span></a>
        <nav aria-label="Main navigation">
          <a href="#about">About</a><a href="#work">Work</a><a href="#experience">Experience</a><a href="#skills">Skills</a>
        </nav>
        <a className="nav-contact" href="mailto:fyibole@gmu.edu">Let's talk <Arrow diagonal /></a>
      </header>

      <main>
        <section className="hero wrap" id="home">
          <div className="hero-copy">
            <div className="eyebrow"><span className="status-dot" /> SOFTWARE ENGINEER · NORTHERN VIRGINIA</div>
            <h1>Building things<br />that <span className="gradient-text">move forward.</span></h1>
            <p className="hero-lede">I'm Evan — a Computer Science student at George Mason University who enjoys turning complex problems into useful software.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work">Explore my work <Arrow /></a>
              <a className="button button-quiet" href="https://github.com/Evan0x" target="_blank" rel="noreferrer">GitHub <Arrow diagonal /></a>
            </div>
            <div className="hero-meta"><span>BS · COMPUTER SCIENCE</span><span>EXPECTED 2029</span></div>
          </div>
          <div className="hero-art">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" />
            <ProfilePortrait />
            <div className="art-caption"><span className="caption-line" /> BUILD · LEARN · REPEAT</div>
            <div className="art-index">FIG. 001<br />IN PROGRESS</div>
          </div>
          <div className="scroll-cue"><span /> SCROLL TO EXPLORE</div>
        </section>

        <section className="intro-section wrap section-grid" id="about">
          <div className="section-label"><span>01 / ABOUT</span><i /></div>
          <div className="intro-content">
            <h2>Curious by default.<br /><span className="muted">Builder by choice.</span></h2>
            <div className="intro-bottom">
              <p>I'm a Computer Science student at <strong>George Mason University</strong>, interested in backend engineering, full-stack development, and cloud technologies. I like understanding how systems work beneath the surface — then using that knowledge to build something people can actually use.</p>
              <p>My path has taken me across different communities and perspectives. Outside of code, you'll find me learning something new, playing basketball, or exploring ideas with people who are building things too.</p>
            </div>
          </div>
        </section>

        <section className="work-section wrap" id="work">
          <div className="section-heading">
            <div><div className="section-label"><span>02 / SELECTED WORK</span><i /></div><h2>Ideas into <span className="gradient-text">software.</span></h2></div>
            <span className="section-aside">A FEW THINGS I'VE BEEN WORKING ON ↘</span>
          </div>
          <Projects />
        </section>

        <section className="experience-section wrap section-grid" id="experience">
          <div className="section-label"><span>03 / EXPERIENCE</span><i /></div>
          <div className="experience-content">
            <div className="experience-row">
              <div><div className="project-type">MAY — AUG 2026 · REMOTE</div><h3>Software Engineering Intern</h3><div className="company">Knobull Software</div></div>
              <div className="experience-detail">
                <p>Contributed to an AI-powered course discovery platform using React, TypeScript, Node.js, Python, and Supabase.</p>
                <ul>
                  <li>Built responsive and accessible interface improvements.</li>
                  <li>Worked on Python text chunking and embedding workflows with Supabase pgvector.</li>
                  <li>Consolidated backend API behavior, contributing to a reported 15% latency reduction.</li>
                </ul>
                <a href="https://github.com/samuelhsuu/Knobull-ASE/tree/Evan" target="_blank" rel="noreferrer" className="text-link">View code <Arrow diagonal /></a>
              </div>
            </div>
            <div className="education-row">
              <div><div className="project-type">2026 — PRESENT</div><h3>George Mason University</h3><div className="company">Computer Science · Expected 2029</div></div>
              <p>Building a strong foundation in computer science while exploring software engineering, data structures, algorithms, and cloud technologies.</p>
            </div>
          </div>
        </section>

        <section className="skills-section wrap" id="skills">
          <div className="section-heading">
            <div><div className="section-label"><span>04 / TOOLKIT</span><i /></div><h2>Tools of the <span className="gradient-text">trade.</span></h2></div>
            <span className="section-aside">ALWAYS LEARNING SOMETHING NEW</span>
          </div>
          <div className="skills-list">
            {skills.map(([n, title, desc]) => <div className="skill-row" key={n}><span className="skill-number">{n}</span><h3>{title}</h3><p>{desc}</p><span className="skill-plus">+</span></div>)}
          </div>
        </section>

        <section className="contact-section wrap" id="contact">
          <div className="contact-orb" aria-hidden="true" />
          <div className="section-label"><span>05 / WHAT'S NEXT?</span><i /></div>
          <div className="contact-inner">
            <p className="project-type">HAVE A PROJECT OR OPPORTUNITY?</p>
            <h2>Let's make<br /><span className="gradient-text">something matter.</span></h2>
            <a className="button button-primary" href="mailto:fyibole@gmu.edu">Get in touch <Arrow diagonal /></a>
          </div>
          <div className="contact-links">
            <a href="mailto:fyibole@gmu.edu">EMAIL <Arrow diagonal /><small>fyibole@gmu.edu</small></a>
            <a href="tel:+12024397565">PHONE <Arrow diagonal /><small>(202) 439-7565</small></a>
            <a href="https://github.com/Evan0x" target="_blank" rel="noreferrer">GITHUB <Arrow diagonal /><small>github.com/Evan0x</small></a>
            <a href="https://www.linkedin.com/in/evanyibole/" target="_blank" rel="noreferrer">LINKEDIN <Arrow diagonal /><small>linkedin.com/in/evanyibole</small></a>
          </div>
        </section>
      </main>

      <footer className="footer wrap"><a className="wordmark" href="#home">EY<span>.</span></a><span>DESIGNED & BUILT BY EVAN YIBOLE</span><span>© {new Date().getFullYear()} · KEEP BUILDING.</span></footer>
    </div>
  );
}

export default App;
