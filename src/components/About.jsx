import { Section } from './Section.jsx';
import './About.css';

export function About() {
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
      aside="A student of the layer under the interface."
    >
      <div className="notes">
        <p className="prose">
          I'm a Computer Science student at <strong>George Mason University</strong>, interested in backend engineering, full-stack development, and cloud technologies. I like understanding how systems work beneath the surface — then using that knowledge to build something people can actually use.
        </p>
        <p className="prose">
          My path has taken me across different communities and perspectives. Outside of code, you'll find me learning something new, playing basketball, or exploring ideas with people who are building things too.
        </p>
      </div>
    </Section>
  );
}
