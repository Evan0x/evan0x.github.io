import {
  about,
  education,
  experience,
  profile,
  projects,
  skills,
} from '../data/site.js';
import { isStudyHash } from '../hooks/useHashView.js';
import { scrollToHash } from '../motion/scroll.js';

export function openUrl(url) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function goTo(hash, reduced) {
  if (isStudyHash(hash) || isStudyHash(window.location.hash)) {
    window.location.hash = hash;
    return;
  }
  scrollToHash(hash, { reduced });
}

export async function copyEmail() {
  const value = profile.email;
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const field = document.createElement('textarea');
  field.value = value;
  field.setAttribute('readonly', '');
  field.style.position = 'fixed';
  field.style.top = '-1000px';
  document.body.appendChild(field);
  field.select();
  document.execCommand('copy');
  field.remove();
}

export function downloadResume() {
  const link = document.createElement('a');
  link.href = profile.resume;
  link.download = 'Evan-Yibole-Resume.pdf';
  link.rel = 'noreferrer';
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export const paletteCommands = [
  {
    id: 'home',
    group: 'Navigate',
    label: 'Home',
    hint: 'Landing',
    keys: 'home index landing hero',
    run: ({ reduced }) => goTo('#index', reduced),
  },
  {
    id: 'about',
    group: 'Navigate',
    label: 'About',
    hint: 'Field notes',
    keys: 'about notes core',
    run: ({ reduced }) => goTo('#notes', reduced),
  },
  {
    id: 'projects',
    group: 'Navigate',
    label: 'Projects',
    hint: 'Laboratory',
    keys: 'projects work lab systems',
    run: ({ reduced }) => goTo('#work', reduced),
  },
  {
    id: 'experience',
    group: 'Navigate',
    label: 'Experience',
    hint: 'Knobull',
    keys: 'experience record intern knobull',
    run: ({ reduced }) => goTo('#record', reduced),
  },
  {
    id: 'skills',
    group: 'Navigate',
    label: 'Skills',
    hint: 'Operating set',
    keys: 'skills stack toolkit',
    run: ({ reduced }) => goTo('#stack', reduced),
  },
  {
    id: 'source',
    group: 'Navigate',
    label: 'GitHub Dashboard',
    hint: 'Source',
    keys: 'github dashboard source repos activity',
    run: ({ reduced }) => goTo('#source', reduced),
  },
  {
    id: 'contact',
    group: 'Navigate',
    label: 'Contact',
    hint: 'Channel',
    keys: 'contact channel email',
    run: ({ reduced }) => goTo('#channel', reduced),
  },
  {
    id: 'github',
    group: 'Actions',
    label: 'Open GitHub',
    hint: 'github.com/Evan0x',
    keys: 'github git repo',
    run: () => openUrl(profile.github),
  },
  {
    id: 'linkedin',
    group: 'Actions',
    label: 'Open LinkedIn',
    hint: 'linkedin.com/in/evanyibole',
    keys: 'linkedin social',
    run: () => openUrl(profile.linkedin),
  },
  {
    id: 'email',
    group: 'Actions',
    label: 'Copy email',
    hint: profile.email,
    keys: 'copy email mail clipboard',
    run: () => copyEmail(),
  },
  {
    id: 'resume',
    group: 'Actions',
    label: 'Download resume',
    hint: 'PDF',
    keys: 'resume cv pdf download',
    run: () => downloadResume(),
  },
  {
    id: 'syllacal',
    group: 'Actions',
    label: 'Open SyllaCal project',
    hint: 'GitHub',
    keys: 'syllacal project calendar',
    run: () => openUrl(projects[0].primary.href),
  },
  ...projects.map((project) => ({
    id: `study-${project.id}`,
    group: 'Case studies',
    label: `${project.name} case study`,
    hint: project.number,
    keys: `${project.name} study case ${project.id} engineering`,
    run: ({ reduced }) => goTo(project.studyHref, reduced),
  })),
];

export function filterPaletteCommands(query) {
  const needle = query.trim().toLowerCase();
  if (!needle) return paletteCommands;
  return paletteCommands.filter((item) => {
    const hay = `${item.label} ${item.hint} ${item.group} ${item.keys}`.toLowerCase();
    return hay.includes(needle);
  });
}

const COMMAND_NAMES = [
  'help',
  'whoami',
  'about',
  'projects',
  'study',
  'experience',
  'skills',
  'source',
  'github',
  'linkedin',
  'contact',
  'resume',
  'clear',
  'exit',
];

export const terminalCommands = COMMAND_NAMES;

function lines(...rows) {
  return rows;
}

const handlers = {
  help: () =>
    lines(
      'Available commands',
      '',
      'help          List commands',
      'whoami        Name and role',
      'about         School, horizon, interests',
      'projects      SyllaCal, Avelamed, AveLoop, Hangman',
      'study         Open a case study: study syllacal',
      'experience    Knobull internship',
      'skills        Languages and services',
      'source        Open the GitHub dashboard',
      'github        Open GitHub',
      'linkedin      Open LinkedIn',
      'contact       Email and phone',
      'resume        Download the PDF',
      'clear         Clear the screen',
      'exit          Close this session'
    ),
  whoami: () =>
    lines(
      profile.name,
      profile.role,
      profile.focus
    ),
  about: () =>
    lines(
      about.name,
      about.role,
      about.expected.replace(' · ', ': '),
      '',
      'Interests',
      ...about.interests.map((item) => `  - ${item}`)
    ),
  projects: () =>
    projects.flatMap((project, index) => [
      `${project.number}  ${project.name}`,
      `    ${project.description}`,
      `    ${project.stack.join(' · ')}`,
      `    ${project.primary.href}`,
      `    case study  ${project.studyHref}`,
      ...(index < projects.length - 1 ? [''] : []),
    ]),
  study: (rest) => {
    const query = rest.join(' ').trim().toLowerCase();
    if (!query) {
      return lines(
        'Usage: study <name>',
        ...projects.map((project) => `  ${project.id.padEnd(10)} ${project.name}`)
      );
    }
    const match = projects.find(
      (project) => project.id === query || project.name.toLowerCase() === query
    );
    if (!match) {
      return lines(`no case study named ${query}`, 'Try study syllacal');
    }
    goTo(match.studyHref, false);
    return lines(`Opening ${match.name} case study.`);
  },
  experience: () =>
    lines(
      `${experience.role} · ${experience.org}`,
      `${experience.when} · ${experience.place}`,
      experience.summary,
      '',
      ...experience.work.map((item) => `  ${item.index}  ${item.label} — ${item.text}`),
      '',
      `${education.role} · ${education.org}`,
      `${education.when} · ${education.place}`
    ),
  skills: () =>
    skills.flatMap((rack, index) => [
      `${rack.index}  ${rack.title}`,
      `    ${rack.items.join(' · ')}`,
      ...(index < skills.length - 1 ? [''] : []),
    ]),
  source: () => {
    goTo('#source', false);
    return lines('Opening the GitHub dashboard.');
  },
  github: () => {
    openUrl(profile.github);
    return lines(profile.github, 'Opening GitHub in a new tab.');
  },
  linkedin: () => {
    openUrl(profile.linkedin);
    return lines(profile.linkedin, 'Opening LinkedIn in a new tab.');
  },
  contact: () =>
    lines(
      `email     ${profile.email}`,
      `phone     ${profile.phoneDisplay}`,
      `github    ${profile.github}`,
      `linkedin  ${profile.linkedin}`
    ),
  resume: () => {
    downloadResume();
    return lines(profile.resume, 'Starting resume download.');
  },
};

export function runTerminalCommand(raw) {
  const input = raw.trim();
  if (!input) return { kind: 'empty' };

  const [name, ...rest] = input.split(/\s+/);
  const command = name.toLowerCase();

  if (command === 'clear') return { kind: 'clear' };
  if (command === 'exit' || command === 'close') return { kind: 'exit' };

  const handler = handlers[command];
  if (!handler) {
    return {
      kind: 'output',
      lines: [`command not found: ${name}`, 'Type help to list commands.'],
    };
  }

  return { kind: 'output', lines: handler(rest) };
}

export function autocompleteCommand(value) {
  if (value.includes(' ')) return null;
  const token = value.trim().toLowerCase();
  if (!token) return COMMAND_NAMES;
  const matches = COMMAND_NAMES.filter((name) => name.startsWith(token));
  if (matches.length === 1) return matches[0];
  if (matches.length > 1) return matches;
  return null;
}
