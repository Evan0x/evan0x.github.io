import { channels } from '../data/site.js';
import { itemReveal, listReveal, m, useMotionPrefs } from '../motion/MotionProvider.jsx';
import { Section } from './Section.jsx';
import './Contact.css';

export function Contact() {
  const prefs = useMotionPrefs();

  return (
    <Section
      id="channel"
      index="06"
      kicker="Channel"
      title="Open a channel."
      aside="A project, a role, or a question about how a system should behave."
    >
      <m.div className="channels" {...listReveal(prefs)}>
        {channels.map((channel) => (
          <m.a
            className="channel-row"
            key={channel.label}
            href={channel.href}
            {...(channel.external ? { target: '_blank', rel: 'noreferrer' } : {})}
            {...itemReveal(prefs)}
            whileHover={prefs.lift ? { x: 6, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } } : undefined}
          >
            <span>{channel.label}</span>
            <span>{channel.value}</span>
            <span aria-hidden="true">↗</span>
          </m.a>
        ))}
      </m.div>
    </Section>
  );
}
