export const profile = {
  name: 'Evan Yibole',
  role: 'Computer Science Student @ George Mason University',
  focus: 'Software Engineer | Backend | AI | Cloud',
  subtitle: 'Exploring ideas. Engineering systems. Building products.',
  email: 'fyibole@gmu.edu',
  phoneDisplay: '(202) 439-7565',
  phoneHref: 'tel:+12024397565',
  github: 'https://github.com/Evan0x',
  linkedin: 'https://www.linkedin.com/in/evanyibole/',
  resume: '/resume.pdf',
  portrait: '/images/evan-yibole.jpg',
};

export const navigation = [
  { id: 'notes', index: '01', label: 'Notes' },
  { id: 'work', index: '02', label: 'Work' },
  { id: 'record', index: '03', label: 'Record' },
  { id: 'stack', index: '04', label: 'Stack' },
  { id: 'channel', index: '05', label: 'Channel', emphasis: true },
];

export const constellation = {
  wide: { width: 1000, height: 620 },
  narrow: { width: 1000, height: 1080 },
  nodes: [
    { id: 'core', label: 'Core', subject: 'About Me', href: '#notes', tone: 'violet', x: 500, y: 312, xm: 500, ym: 168, place: 'south', placeNarrow: 'south' },
    { id: 'systems', label: 'Systems', subject: 'SyllaCal', href: '#syllacal', tone: 'cyan', x: 292, y: 118, xm: 236, ym: 430, place: 'north', placeNarrow: 'east' },
    { id: 'intelligence', label: 'Intelligence', subject: 'Avelamed', href: '#avelamed', tone: 'cyan', x: 728, y: 128, xm: 764, ym: 430, place: 'north', placeNarrow: 'west' },
    { id: 'automation', label: 'Automation', subject: 'AveLoop', href: '#aveloop', tone: 'violet', x: 802, y: 398, xm: 764, ym: 730, place: 'east', placeNarrow: 'west' },
    { id: 'experience', label: 'Experience', subject: 'Knobull', href: '#knobull', tone: 'cyan', x: 468, y: 528, xm: 500, ym: 960, place: 'south', placeNarrow: 'north' },
    { id: 'stack', label: 'Stack', subject: 'Technical Skills', href: '#stack', tone: 'violet', x: 198, y: 428, xm: 236, ym: 730, place: 'west', placeNarrow: 'east' },
  ],
  links: [
    ['core', 'systems'],
    ['core', 'intelligence'],
    ['core', 'automation'],
    ['core', 'experience'],
    ['core', 'stack'],
    ['systems', 'intelligence'],
    ['intelligence', 'automation'],
    ['automation', 'experience'],
    ['experience', 'stack'],
    ['stack', 'systems'],
  ],
};

export const projects = [
  {
    id: 'syllacal',
    number: '01',
    name: 'SyllaCal',
    kicker: 'Featured · PDF → calendar',
    description:
      'A Spring Boot service that turns a university syllabus PDF into a downloadable .ics file. PDFBox extracts the text, Gemini returns structured events, and a validator drops undated items and merges duplicate title-and-date pairs before ical4j builds the calendar.',
    stack: ['Java', 'Spring Boot', 'PDFBox', 'Gemini', 'ical4j', 'React'],
    image: '/images/projects/syllacal.jpg',
    width: 1024,
    height: 665,
    alt: 'SyllaCal homepage with a syllabus PDF drop zone, course name field, semester start and end dates, and a Generate calendar button.',
    primary: {
      href: 'https://github.com/Evan0x/SyllaCal',
      label: 'View SyllaCal on GitHub',
    },
    links: [{ label: 'GitHub', href: 'https://github.com/Evan0x/SyllaCal' }],
  },
  {
    id: 'avelamed',
    number: '02',
    name: 'Avelamed',
    kicker: 'Healthcare product',
    description:
      'A care-finding interface for locating clinics and keeping the next step understandable. The React frontend searches on a map, and a Gemini assistant sits in the same product so questions and follow-up are part of the workflow, not a separate tool.',
    stack: ['React', 'Vite', 'Google Maps', 'Gemini', 'Supabase'],
    image: '/images/projects/avelamed.jpg',
    width: 1024,
    height: 665,
    alt: 'Avelamed homepage with a world map background, a location search field, and Find Me and Search buttons.',
    primary: {
      href: 'https://avelamed.vercel.app/',
      label: 'Open the Avelamed live site',
    },
    links: [
      { label: 'Live demo', href: 'https://avelamed.vercel.app/' },
      { label: 'GitHub', href: 'https://github.com/Evan0x/MED' },
    ],
  },
  {
    id: 'aveloop',
    number: '03',
    name: 'AveLoop',
    kicker: 'AI agent',
    description:
      'An agent that turns a discharge note into a plan a patient can follow. It extracts medications and follow-ups from a photo or PDF, then Fo can put the visit on a calendar, send the email, and place the call.',
    stack: ['Next.js', 'TypeScript', 'Gemini', 'Supabase', 'Clerk'],
    image: '/images/projects/aveloop.jpg',
    width: 1024,
    height: 665,
    alt: 'AveLoop homepage with a discharge notes field, a photo or PDF upload option, and an Extract my care plan button.',
    primary: {
      href: 'https://aveloop.vercel.app/',
      label: 'Open the AveLoop live site',
    },
    links: [
      { label: 'Live demo', href: 'https://aveloop.vercel.app/' },
      { label: 'GitHub', href: 'https://github.com/Evan0x/AveLoop' },
    ],
  },
];

export const experience = {
  id: 'knobull',
  when: 'May — Aug 2026',
  place: 'Remote',
  role: 'Software Engineering Intern',
  org: 'Knobull Software',
  summary:
    'Contributed to an AI-powered course discovery platform using React, TypeScript, Node.js, Python, and Supabase.',
  points: [
    'Built responsive and accessible interface improvements.',
    'Worked on Python text chunking and embedding workflows with Supabase pgvector.',
    'Consolidated backend API behavior, contributing to a reported 15% latency reduction.',
  ],
  href: 'https://github.com/samuelhsuu/Knobull-ASE/tree/Evan',
  linkLabel: 'View code',
};

export const education = {
  when: '2026 — Present',
  place: 'Expected 2029',
  role: 'George Mason University',
  org: 'BS · Computer Science',
  summary:
    'Building a strong foundation in computer science while exploring software engineering, data structures, algorithms, and cloud technologies.',
};

export const skills = [
  ['01', 'Languages', 'Java · Python · JavaScript · TypeScript · SQL'],
  ['02', 'Backend', 'Spring Boot · Spring MVC · Maven · Node.js · Express · REST APIs · PDFBox'],
  ['03', 'Frontend', 'React · Next.js · HTML · CSS'],
  ['04', 'Data & AI', 'PostgreSQL · Supabase · pgvector · Gemini · LLM APIs · Pandas'],
  ['05', 'Cloud & Tools', 'AWS EC2 · Amazon ECR · Docker · Clerk · Google Cloud Text-to-Speech · Git · GitHub'],
];

export const channels = [
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
  { label: 'Phone', value: profile.phoneDisplay, href: profile.phoneHref },
  { label: 'GitHub', value: 'github.com/Evan0x', href: profile.github, external: true },
  { label: 'LinkedIn', value: 'linkedin.com/in/evanyibole', href: profile.linkedin, external: true },
  { label: 'Resume', value: 'PDF', href: profile.resume },
];
