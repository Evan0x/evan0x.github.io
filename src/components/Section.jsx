import './Section.css';

export function Section({ id, index, kicker, title, aside, children }) {
  return (
    <section className="section" id={id} aria-labelledby={`${id}-title`}>
      <div className="wrap">
        <header className="section-head">
          <div>
            <p className="kicker">
              <span className="kicker-index">{index}</span>
              {kicker}
            </p>
            <h2 id={`${id}-title`}>{title}</h2>
          </div>
          {aside ? <p className="section-aside">{aside}</p> : null}
        </header>
        {children}
      </div>
    </section>
  );
}
