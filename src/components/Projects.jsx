import { projects } from '../data/site.js';
import { Section } from './Section.jsx';
import './Projects.css';

function Shot({ project }) {
  return (
    <a className="record-shot" href={project.primary.href} target="_blank" rel="noreferrer">
      <span className="sr-only">{project.primary.label}</span>
      <img
        src={project.image}
        alt={project.alt}
        width={project.width}
        height={project.height}
        loading="lazy"
        decoding="async"
      />
    </a>
  );
}

export function Projects() {
  return (
    <Section
      id="work"
      index="02"
      kicker="Instruments"
      title="Selected systems."
      aside="Three builds, each shaped by a constraint someone actually has."
    >
      <div className="records">
        {projects.map((project) => (
          <article className="record" id={project.id} key={project.id}>
            <p className="record-index">{project.number}</p>
            <div className="record-copy">
              <p className="kicker">{project.kicker}</p>
              <h3>
                <a href={project.primary.href} target="_blank" rel="noreferrer">
                  {project.name}
                </a>
              </h3>
              <p className="prose">{project.description}</p>
              <ul className="tags">
                {project.stack.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="record-links">
                {project.links.map((link) => (
                  <a key={link.label} className="text-link" href={link.href} target="_blank" rel="noreferrer">
                    {link.label} <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            </div>
            <Shot project={project} />
          </article>
        ))}
      </div>
    </Section>
  );
}
