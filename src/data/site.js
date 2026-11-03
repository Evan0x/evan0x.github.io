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
    layout: 'primary',
    category: 'Backend Engineering / AI Integration',
    description:
      'A system that transforms university syllabus PDFs into downloadable calendar files.',
    problem:
      'A syllabus already holds the dates. The work is getting those dates out of a PDF and into a calendar without typing them by hand.',
    stack: ['Java', 'Spring Boot', 'Apache PDFBox', 'Gemini API', 'ical4j'],
    frames: [
      {
        src: '/images/projects/syllacal-intake.png',
        alt: 'SyllaCal homepage with a syllabus PDF drop zone, course name field, semester start and end dates, and a Generate calendar button.',
        caption: '01 · Intake',
        note: 'One PDF, a course name, and the term bounds.',
      },
      {
        src: '/images/projects/syllacal-build.png',
        alt: 'SyllaCal generating a calendar for MATH 114, showing a progress state labeled Finding assignments and exams.',
        caption: '02 · Extract',
        note: 'The request waits on text extraction and the model call.',
      },
      {
        src: '/images/projects/syllacal-review.png',
        alt: 'SyllaCal review screen for MATH 114 listing three exams with edit, delete, add event, and export calendar controls.',
        caption: '03 · Review',
        note: 'Events can be edited, removed, or added before export.',
      },
    ],
    pipeline: [
      { label: 'PDF', detail: 'Header check · 10 MB cap' },
      { label: 'PDFBox', detail: 'Text by page' },
      { label: 'Gemini', detail: 'JSON events' },
      { label: 'Validator', detail: 'Drop · merge' },
      { label: 'ical4j', detail: '.ics download' },
    ],
    decisions: [
      {
        title: 'Trust the file, not the name',
        text: 'The upload is accepted as a PDF from its %PDF- header. Encrypted files are rejected. Extraction under 200 characters is treated as a likely scan and stopped. There is no OCR.',
      },
      {
        title: 'Structure after extraction',
        text: 'PDFBox returns page text. Gemini is asked for JSON events with a title, type, date, time, weight, confidence, and a short source quote. The prompt includes the term start and end so phrases such as “Week 5 Friday” can be turned into a date.',
      },
      {
        title: 'Validate what the model returns',
        text: 'EventValidator drops events with no date and merges duplicate title-and-date pairs. It does not remove out-of-term or low-confidence events. Those cases are recorded as warnings and are not shown in the file.',
      },
      {
        title: 'Keep the calendar boring',
        text: 'ical4j writes the .ics. An event with no time is all-day. An event with a time is stored in UTC. The form has no timezone field, and events do not get an end time.',
      },
    ],
    width: 1024,
    height: 665,
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
    layout: 'field',
    category: 'AI / Healthcare Workflow',
    description:
      'A location-aware care-finding interface for locating clinics and asking follow-up questions in the same product.',
    problem:
      'Finding care is both a map query and a ranking problem. A list of places is not enough if the next step is still unclear.',
    stack: ['React', 'Vite', 'Google Maps', 'Gemini', 'Supabase', 'Clerk'],
    frames: [
      {
        src: '/images/projects/avelamed.jpg',
        alt: 'Avelamed homepage with a world map background, a location search field, and Find Me and Search buttons.',
        caption: 'Field · Locate',
        note: 'Search from a typed location or Find Me.',
      },
    ],
    pipeline: [
      { label: 'Place', detail: 'Maps + Places' },
      { label: 'Rank', detail: 'Bayesian score' },
      { label: 'Assist', detail: 'Gemini chat' },
    ],
    decisions: [
      {
        title: 'Rank, then show',
        text: 'Google Places results are scored before they hit the list. The live ranking is 0.50 rating, 0.30 distance, 0.12 open-now, and 0.08 price. The top result is Best Overall; a second card follows the sort the user picked.',
      },
      {
        title: 'Keep the assistant in the product',
        text: 'AvelaAI is a Gemini chat on the same surface as the map, not a separate tool. The system prompt stays non-prescriptive and sends emergencies to 911.',
      },
      {
        title: 'Profile as a shareable record',
        text: 'Signed-in health profiles live in Supabase. The passport can be exported as a PDF or opened as a read-only overview from a QR code.',
      },
    ],
    width: 1024,
    height: 665,
    primary: {
      href: 'https://avelamed.vercel.app/',
      label: 'Open the Avelamed live site',
    },
    links: [
      { label: 'Live site', href: 'https://avelamed.vercel.app/' },
      { label: 'GitHub', href: 'https://github.com/Evan0x/MED' },
    ],
  },
  {
    id: 'aveloop',
    number: '03',
    name: 'AveLoop',
    layout: 'agent',
    category: 'AI Agents / Automation',
    description:
      'An AI agent and automation project that turns a discharge note into a care plan, then walks through calendar, email, and workflow steps.',
    problem:
      'A discharge note is a block of instructions. The week after the visit is a sequence of actions that still has to be extracted, checked, and carried out.',
    stack: ['Next.js', 'TypeScript', 'Gemini', 'Supabase', 'Clerk'],
    frames: [
      {
        src: '/images/projects/aveloop.jpg',
        alt: 'AveLoop homepage with a discharge notes field, a photo or PDF upload option, and an Extract my care plan button.',
        caption: 'Agent · Intake',
        note: 'Paste the note, or send a photo or PDF.',
      },
    ],
    pipeline: [
      { label: 'Note', detail: 'Text · photo · PDF' },
      { label: 'Extract', detail: 'Gemini plan' },
      { label: 'Review', detail: 'Meds · follow-ups' },
      { label: 'Fo', detail: 'Approved steps' },
    ],
    decisions: [
      {
        title: 'Extract, then stop for a person',
        text: 'Gemini pulls medications, follow-ups, warnings, and next actions. Ready steps are separated from ones that still need a date or a clinic before anything is sent on.',
      },
      {
        title: 'Automation is optional, not assumed',
        text: 'Approved steps run one at a time through Fo. Google Calendar and email go out when that path is configured. Without it, the app confirms the steps in place and does not write to a calendar.',
      },
      {
        title: 'Keep a copy if someone signs in',
        text: 'Signed-in plans are stored in Supabase so they can be reopened from History. A caregiver can open a read-only share link, and the plan can be downloaded as a PDF.',
      },
    ],
    width: 1024,
    height: 665,
    primary: {
      href: 'https://aveloop.vercel.app/',
      label: 'Open the AveLoop live site',
    },
    links: [
      { label: 'Live site', href: 'https://aveloop.vercel.app/' },
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
  href: 'https://www.knobull.com/',
  linkLabel: 'Visit Knobull',
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
