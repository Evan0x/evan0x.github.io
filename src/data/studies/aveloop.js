const src = 'https://github.com/Evan0x/AveLoop/blob/main';

export const aveloopStudy = {
  id: 'aveloop',
  number: '03',
  name: 'AveLoop',
  kicker: 'Agent system',
  category: 'AI Agents / Automation',
  stage: 'Next.js app on Vercel. Calendar writes only happen when WAJO_TOKEN is set.',
  repo: 'https://github.com/Evan0x/AveLoop',
  live: 'https://aveloop.vercel.app/',
  stack: ['Next.js', 'TypeScript', 'Clerk', 'Supabase', 'Gemini', 'Fo / Wajo (optional)'],
  links: [
    { label: 'Live site', href: 'https://aveloop.vercel.app/' },
    { label: 'Repository', href: 'https://github.com/Evan0x/AveLoop' },
    { label: 'extract-care-plan.ts', href: `${src}/lib/extract-care-plan.ts` },
  ],
  architecture: {
    kicker: 'Click a stage',
    lede: 'Extract, stop for a person, then run approved steps one at a time. Fo is optional.',
    nodes: [
      {
        id: 'extract-route',
        label: 'Extract route',
        plain: 'A signed-in POST accepts pasted notes or a photo/PDF up to 8 MB.',
        responsibility: 'requireUserId() from Clerk. Reject short notes when there is no file. Return the CareData JSON that extraction produced.',
        technology: 'app/api/extract/route.ts · Clerk auth',
        decision: 'maxDuration is 60 seconds. Notes without a file must be at least 20 characters. The file cap is 8 MB, separate from SyllaCal’s 10 MB PDF cap.',
        source: { file: 'app/api/extract/route.ts', href: `${src}/app/api/extract/route.ts` },
        snippet: `if (!attachment && (!notes || notes.trim().length < 20)) {
  return NextResponse.json(
    { error: "Paste notes or upload a discharge photo/PDF." },
    { status: 400 }
  );
}`,
      },
      {
        id: 'model',
        label: 'Model cascade',
        plain: 'Google first, then Anthropic if that key exists, otherwise the Claude CLI.',
        responsibility: 'Force a care-plan JSON schema. Normalize missing arrays and action fields before enrichment.',
        technology: 'extractCarePlan · generateGoogleText · gemini-3.5-flash-lite',
        decision: 'googleApiKey() looks through GOOGLE_TTS_API_KEY, GOOGLE_GEMINI_API_KEY, GEMINI_API_KEY, and GOOGLE_API_KEY. GEMINI_MODEL overrides the default gemini-3.5-flash-lite.',
        source: { file: 'lib/extract-care-plan.ts', href: `${src}/lib/extract-care-plan.ts` },
        snippet: `const raw = googleApiKey()
  ? await extractWithGoogle(notes, attachment)
  : process.env.ANTHROPIC_API_KEY
    ? await extractWithApi(notes, attachment)
    : await extractWithCli(notes, attachment);
return enrichCarePlan(raw);`,
      },
      {
        id: 'enrich',
        label: 'Enrichment',
        plain: 'Deterministic rules add medication reminders and call steps after the model returns.',
        responsibility: 'Fill calendar reminders for each medication, mark vague times as needs_input, and add pharmacy/clinic call actions when the note mentions them.',
        technology: 'lib/enrich-care-plan.ts',
        decision: 'Medication times default to 8:00, 12:00, and 18:00. Dr. Rivera / Riverside Family Clinic is a named follow-up the enricher special-cases for the sample discharge.',
        source: { file: 'lib/enrich-care-plan.ts', href: `${src}/lib/enrich-care-plan.ts` },
        snippet: `actions.push({
  id: \`med_reminder_\${index + 1}\`,
  type: "calendar",
  label: \`Set \${med.name} reminders\`,
  status: needsTimes ? "needs_input" : "ready",
  missing: needsTimes ? ["times"] : [],
});`,
      },
      {
        id: 'review',
        label: 'Review',
        plain: 'Ready steps are separated from ones that still need a date, clinic, or phone number.',
        responsibility: 'Let the patient change suggested times. A blank phone number skips the call and does not block Approve & Send to Fo.',
        technology: 'app/review · CareData actions',
        decision: 'The product stops for a person here. Extraction is not allowed to write a calendar by itself.',
        source: { file: 'README.md', href: `${src}/README.md` },
      },
      {
        id: 'fo',
        label: 'Fo execute',
        plain: 'Approved actions run one at a time. Calendar and email go through Fo when WAJO_TOKEN is set.',
        responsibility: 'Build a Fo prompt per action. Classify the reply as complete or needs_clarification. Without the token, the Google key confirms the step in-app and does not write Google Calendar.',
        technology: 'lib/fo-execute.ts · WAJO_TOKEN · mcp.api.wajo.ai/fo',
        decision: 'Automation is a configuration, not a default. The README states that absence of WAJO_TOKEN means in-app confirmation only.',
        source: { file: 'lib/fo-execute.ts', href: `${src}/lib/fo-execute.ts` },
        snippet: `const closing = needsClinic
  ? "Ask which clinic in one short question. Do not book anything in this reply."
  : placingCall
    ? process.env.WAJO_TOKEN
      ? "Place the call now. ..."
      : "Write the exact 2 sentences Fo will speak on the call. Do not say the call already connected."
    : "If a Google/Gmail connector needs authorization, say so clearly...";`,
      },
    ],
  },
  flow: {
    lede: 'The model proposes a plan. Code enriches it. A person approves it. Fo may or may not be wired.',
    steps: [
      { id: 'note', label: 'Note', detail: 'Text, photo, or PDF' },
      { id: 'extract', label: 'Extract', detail: 'Schema JSON' },
      { id: 'enrich', label: 'Enrich', detail: 'Reminders + calls' },
      { id: 'review', label: 'Review', detail: 'needs_input vs ready' },
      { id: 'run', label: 'Execute', detail: 'Fo or in-app confirm' },
      { id: 'keep', label: 'Keep', detail: 'Supabase or localStorage' },
    ],
  },
  apis: [
    {
      id: 'extract',
      title: 'Extract a care plan',
      method: 'POST',
      path: '/api/extract',
      status: '200',
      note: 'JSON { notes } or multipart notes + file. Clerk session required. Response is CareData, not a file.',
      source: { file: 'app/api/extract/route.ts', href: `${src}/app/api/extract/route.ts` },
      request: `POST /api/extract
Authorization: Clerk session
Content-Type: application/json

{ "notes": "Discharge summary, at least 20 characters..." }`,
      response: `HTTP 200
{
  "medications": [...],
  "followups": [...],
  "warnings": [...],
  "care_instructions": [...],
  "actions": [...],
  "needs_clarification": [...]
}`,
    },
    {
      id: 'extract-errors',
      title: 'Extract failures',
      method: 'POST',
      path: '/api/extract',
      status: '401 / 400 / 500',
      note: 'Unauthorized is a Clerk miss. FILE_TOO_LARGE is 8 MB. SyntaxError from the model parse becomes a 500 asking the user to retry.',
      source: { file: 'app/api/extract/route.ts', href: `${src}/app/api/extract/route.ts` },
      request: `POST /api/extract
{ "notes": "too short" }`,
      response: `HTTP 401
{ "error": "Unauthorized" }

HTTP 400
{ "error": "Paste notes or upload a discharge photo/PDF." }

HTTP 400
{ "error": "File is too large (max 8MB)." }

HTTP 500
{ "error": "Failed to parse AI response. Please try again." }`,
    },
  ],
  snippets: [
    {
      id: 'schema',
      file: 'lib/extract-care-plan.ts',
      href: `${src}/lib/extract-care-plan.ts`,
      caption: 'The extractor asks for actions with ready | needs_input, not for a finished calendar',
      code: `const SYSTEM_PROMPT = \`Extract a patient care plan from discharge notes...
- status="ready" when all details are clear and specific
- status="needs_input" when times or dates are vague
- missing=["times"] for vague medication schedule times,
  ["dates"] for vague appointment dates,
  ["clinic"] when clinic is ambiguous\`;`,
    },
    {
      id: 'fo',
      file: 'lib/fo-execute.ts',
      href: `${src}/lib/fo-execute.ts`,
      caption: 'Classify Fo’s prose so the UI knows whether to stop and ask',
      code: `export function classifyFoResponse(response: string): "needs_clarification" | "complete" {
  const created = /\\b(created|scheduled|added|booked)\\b[\\s\\S]{0,80}\\b(event|appointment|...)/.test(text);
  if (created && !failed && !asksClinic) return "complete";
  if (text.includes("?") || /which (clinic|location|one)|need to know/.test(text)) {
    return "needs_clarification";
  }
  return "complete";
}`,
    },
  ],
  beforeAfter: {
    title: 'With and without WAJO_TOKEN',
    evidence: 'README Environment and Fo sections, plus the WAJO_TOKEN branch in fo-execute.ts.',
    before: {
      label: 'Token unset',
      text: 'Approved steps still run in the product. Replies are generated with the Google key. Those replies do not write Google Calendar events. A call prompt asks Fo to write the two sentences it would speak, and not to claim the call connected.',
    },
    after: {
      label: 'Token set',
      text: 'Fo is reached at the Wajo MCP URL (default https://mcp.api.wajo.ai/fo). Calendar and email tools can run. A call prompt tells Fo to place the call and report who answered.',
    },
  },
  sections: [
    {
      id: 'overview',
      title: 'Overview',
      body: [
        'AveLoop turns a hospital discharge note into a care plan, then walks through the next steps. Paste the note or upload a photo/PDF. Review medications and follow-ups. Send approved actions on to Fo if that path is configured.',
        'The live site is aveloop.vercel.app. Routes include extract, review, execute, history, share, and Clerk sign-in. Signed-in plans can be stored in Supabase; otherwise history stays in localStorage.',
      ],
    },
    {
      id: 'problem',
      title: 'Problem',
      body: [
        'A discharge note is a block of prose. The week after the visit is a sequence of times, pharmacies, and follow-ups that still has to be extracted and carried out.',
        'The product stops between those two states. Vague times stay needs_input. An ambiguous clinic is a question, not a silent booking.',
      ],
    },
    {
      id: 'architecture',
      title: 'System Architecture',
      body: [
        'Next.js App Router with Clerk on the extract API. lib/extract-care-plan.ts is the model boundary. lib/enrich-care-plan.ts is ordinary TypeScript. lib/fo-execute.ts turns an approved Action into a Fo prompt and interprets the reply.',
        'Sibling APIs exist for care-plans, share, speech, symptoms, call-keywords, and Fo. Extraction is the contract documented here because it is the intake boundary.',
      ],
    },
    {
      id: 'stack',
      title: 'Technology Stack',
      items: [
        'Next.js and React 19, TypeScript.',
        'Clerk session on extract (requireUserId).',
        'Supabase for care_plans when configured; localStorage otherwise.',
        'Google Gemini for extraction, follow-up replies, call keywords, and speech. Default model gemini-3.5-flash-lite.',
        'Optional Anthropic API or Claude CLI if no Google key is present.',
        'Optional Fo via WAJO_TOKEN / WAJO_MCP_URL.',
      ],
    },
    {
      id: 'backend',
      title: 'Backend Design',
      body: [
        'Route handlers under app/api. Extraction is a 60-second function that reads JSON or multipart, calls extractCarePlan, and returns JSON.',
        'Auth is fail-closed: no Clerk user, 401. File size and empty notes fail before the model. Model and parse errors become 500s with a short message, truncated to 220 characters.',
      ],
    },
    {
      id: 'api',
      title: 'API Design',
      body: [
        'POST /api/extract is the intake. The success body is the care-plan schema: medications, followups, warnings, care_instructions, actions, needs_clarification.',
        'Actions carry id, type (task | calendar | email | call), label, instruction, status, missing, and result. That shape is what review and Fo consume.',
      ],
    },
    {
      id: 'pipeline',
      title: 'Data Processing Pipeline',
      body: [
        'The system prompt asks for 4–6 actions plus medication reminders, and for missing=["clinic"] rather than inventing a site. JSON is schema-constrained on both the Google and Anthropic paths.',
        'normalizeCareData fills default ids and coerces unknown types to task. enrichCarePlan then adds reminder events, Riverside/Dr. Rivera follow-up handling for the sample note, and call steps when pharmacy or clinic language is present.',
        'Red-flag symptoms are a separate path: the README says trouble breathing or a stiff neck should tell the patient to call 911 instead of waiting on the agent.',
      ],
    },
    {
      id: 'errors',
      title: 'Error Handling and Validation',
      body: [
        'Route-level: 401, 400 for short notes or oversize files, 500 for parse and upstream failures. SyntaxError is mapped to “Failed to parse AI response.”',
        'Plan-level: status and missing[] are the validation. Fo replies are classified with regexes for created/scheduled versus questions and OAuth prompts. That classifier can be wrong; it is a string test, not a tool callback.',
      ],
    },
    {
      id: 'challenges',
      title: 'Engineering Challenges',
      items: [
        'Discharge language is vague (“about 2 weeks”, “with food”). The schema keeps those as needs_input instead of guessing a timestamp.',
        'Clinic names in the sample note are ambiguous across Riverside sites. Enrichment and Fo prompts list CLINIC_OPTIONS and refuse to book until one is chosen.',
        'Live calendar writes need Fo. The app has to be useful when that token is missing.',
        'Calls from iPhone on a Mac are an OS constraint documented in the README, not an in-app dialer.',
      ],
    },
    {
      id: 'decisions',
      title: 'Technical Decisions',
      items: [
        'Schema-first extraction, then a deterministic enricher, so reminder and call steps do not depend on the model remembering them.',
        'Human review between extract and execute.',
        'WAJO_TOKEN as an optional side door, not a required production dependency for the happy path in the app.',
        'Google key cascade so local .env.local and Vercel can use different variable names for the same secret.',
      ],
    },
    {
      id: 'future',
      title: 'Future Improvements',
      body: ['These follow from code that is already specialized or unfinished.'],
      items: [
        'Generalize Dr. Rivera / Riverside handling so enrichment is not tied to the sample discharge.',
        'Replace regex classification of Fo replies with structured tool results, if Fo can return them.',
        'Keep History honest about localStorage versus Supabase so a second browser does not look like a missing account.',
        'Document the Anthropic/CLI fallback in the README the same way the Google key cascade is documented.',
      ],
    },
  ],
};
