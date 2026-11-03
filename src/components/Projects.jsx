const projects = [
  {
    number: "01",
    name: "SyllaCal",
    kicker: "Featured · PDF → calendar",
    description:
      "A Spring Boot service that turns a university syllabus PDF into a downloadable .ics file. PDFBox extracts the text, Gemini returns structured events, and a validator drops undated items and merges duplicate title-and-date pairs before ical4j builds the calendar.",
    stack: ["Java", "Spring Boot", "PDFBox", "Gemini", "ical4j", "React"],
    image: "/images/projects/syllacal.jpg",
    width: 1024,
    height: 665,
    alt: "SyllaCal homepage with a syllabus PDF drop zone, course name field, semester start and end dates, and a Generate calendar button.",
    primary: {
      href: "https://github.com/Evan0x/SyllaCal",
      label: "View SyllaCal on GitHub",
    },
    links: [{ label: "GitHub", href: "https://github.com/Evan0x/SyllaCal" }],
  },
  {
    number: "02",
    name: "Avelamed",
    kicker: "Healthcare product",
    description:
      "A care-finding interface for locating clinics and keeping the next step understandable. The React frontend searches on a map, and a Gemini assistant sits in the same product so questions and follow-up are part of the workflow, not a separate tool.",
    stack: ["React", "Vite", "Google Maps", "Gemini", "Supabase"],
    image: "/images/projects/avelamed.jpg",
    width: 1024,
    height: 665,
    alt: "Avelamed homepage with a world map background, a location search field, and Find Me and Search buttons.",
    primary: {
      href: "https://avelamed.vercel.app/",
      label: "Open the Avelamed live site",
    },
    links: [
      { label: "Live demo", href: "https://avelamed.vercel.app/" },
      { label: "GitHub", href: "https://github.com/Evan0x/MED" },
    ],
  },
  {
    number: "03",
    name: "AveLoop",
    kicker: "AI agent",
    description:
      "An agent that turns a discharge note into a plan a patient can follow. It extracts medications and follow-ups from a photo or PDF, then Fo can put the visit on a calendar, send the email, and place the call.",
    stack: ["Next.js", "TypeScript", "Gemini", "Supabase", "Clerk"],
    image: "/images/projects/aveloop.jpg",
    width: 1024,
    height: 665,
    alt: "AveLoop homepage with a discharge notes field, a photo or PDF upload option, and an Extract my care plan button.",
    primary: {
      href: "https://aveloop.vercel.app/",
      label: "Open the AveLoop live site",
    },
    links: [
      { label: "Live demo", href: "https://aveloop.vercel.app/" },
      { label: "GitHub", href: "https://github.com/Evan0x/AveLoop" },
    ],
  },
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function Shot({ project }) {
  return (
    <a className="project-shot" href={project.primary.href} target="_blank" rel="noreferrer">
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

function Tags({ stack }) {
  return (
    <ul className="tags">
      {stack.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function Actions({ links, tone }) {
  return (
    <div className={`project-actions ${tone ? `project-actions--${tone}` : ""}`}>
      {links.map((link) => (
        <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
          {link.label} <Arrow />
        </a>
      ))}
    </div>
  );
}

export function Projects() {
  const [featured, avelamed, aveloop] = projects;

  return (
    <div className="work-showcase">
      <article className="feature-project">
        <div className="feature-copy">
          <div className="project-kicker">
            <span>{featured.number}</span>
            {featured.kicker}
          </div>
          <h3>
            <a href={featured.primary.href} target="_blank" rel="noreferrer">
              {featured.name}
            </a>
          </h3>
          <p>{featured.description}</p>
          <Tags stack={featured.stack} />
          <Actions links={featured.links} />
        </div>
        <Shot project={featured} />
      </article>

      <div className="project-split">
        <article className="billboard-project">
          <Shot project={avelamed} />
          <div className="billboard-copy">
            <div className="project-kicker">
              <span>{avelamed.number}</span>
              {avelamed.kicker}
            </div>
            <h3>
              <a href={avelamed.primary.href} target="_blank" rel="noreferrer">
                {avelamed.name}
              </a>
            </h3>
            <p>{avelamed.description}</p>
            <Tags stack={avelamed.stack} />
            <Actions links={avelamed.links} />
          </div>
        </article>

        <article className="agent-project">
          <div className="agent-copy">
            <div className="project-kicker">
              <span>{aveloop.number}</span>
              {aveloop.kicker}
            </div>
            <h3>
              <a href={aveloop.primary.href} target="_blank" rel="noreferrer">
                {aveloop.name}
              </a>
            </h3>
            <p>{aveloop.description}</p>
            <Tags stack={aveloop.stack} />
            <Actions links={aveloop.links} tone="cyan" />
          </div>
          <div className="agent-frame">
            <Shot project={aveloop} />
          </div>
        </article>
      </div>
    </div>
  );
}
