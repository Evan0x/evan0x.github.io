import { channels } from '../data/site.js';
import { Section } from './Section.jsx';
import './Contact.css';

export function Contact() {
  return (
    <Section
      id="channel"
      index="05"
      kicker="Channel"
      title="Open a channel."
      aside="A project, a role, or a question about how a system should behave."
    >
      <div className="channels">
        {channels.map((channel) => (
          <a
            className="channel-row"
            key={channel.label}
            href={channel.href}
            {...(channel.external ? { target: '_blank', rel: 'noreferrer' } : {})}
          >
            <span>{channel.label}</span>
            <span>{channel.value}</span>
            <span aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
    </Section>
  );
}
