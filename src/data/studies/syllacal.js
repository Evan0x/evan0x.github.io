import { syllacalArchitecture } from '../syllacalArchitecture.js';

const src = 'https://github.com/Evan0x/SyllaCal/blob/main';

export const syllacalStudy = {
  id: 'syllacal',
  number: '01',
  name: 'SyllaCal',
  kicker: 'Featured case study',
  category: 'Backend Engineering / AI Integration',
  stage: 'Early-stage demo. One request in, one calendar file out.',
  repo: 'https://github.com/Evan0x/SyllaCal',
  stack: ['Java 21', 'Spring Boot', 'Apache PDFBox 3.0.8', 'Gemini generateContent', 'ical4j 4.4.0'],
  links: [
    { label: 'Repository', href: 'https://github.com/Evan0x/SyllaCal' },
    { label: 'SyllabusController.java', href: `${src}/backend/src/main/java/io/github/evan0x/syllacal/web/SyllabusController.java` },
  ],
  architecture: {
    kicker: 'Click a stage',
    lede: 'A PDF goes in. A calendar file comes out. Each node is a real class in the SyllaCal repo.',
    nodes: syllacalArchitecture,
  },
  flow: {
    lede: 'The controller owns the whole pass. Nothing is queued, stored, or reviewed in this request.',
    steps: [
      { id: 'form', label: 'Form', detail: 'PDF, course name, term start, term end' },
      { id: 'gate', label: 'Gates', detail: 'Size, %PDF- header, dates' },
      { id: 'text', label: 'PDFBox', detail: 'Page text, or stop' },
      { id: 'model', label: 'Gemini', detail: 'JSON events, temperature 0' },
      { id: 'clean', label: 'Validator', detail: 'Drop null dates, merge dupes' },
      { id: 'ics', label: 'ical4j', detail: 'text/calendar download' },
    ],
  },
  apis: [
    {
      id: 'success',
      title: 'Create calendar',
      method: 'POST',
      path: '/api/syllabus',
      status: '200',
      note: 'The static page posts FormData and saves the blob. Filename comes from Content-Disposition, or syllabus.ics.',
      source: {
        file: 'static/index.html',
        href: `${src}/backend/src/main/resources/static/index.html`,
      },
      request: `POST /api/syllabus
Content-Type: multipart/form-data

file:        syllabus.pdf
courseName:  MATH 114
termStart:   2026-01-20
termEnd:     2026-05-08`,
      response: `HTTP 200
Content-Type: text/calendar
Content-Disposition: attachment; filename="MATH_114.ics"

BEGIN:VCALENDAR
...
END:VCALENDAR`
    },
    {
      id: 'not-pdf',
      title: 'Reject a non-PDF',
      method: 'POST',
      path: '/api/syllabus',
      status: '400',
      note: 'Acceptance is the %PDF- magic bytes, not the file name. Encrypted files fail later in PDFBox and return 400 Encrypted PDFs are not supported.',
      source: {
        file: 'SyllabusController.java',
        href: `${src}/backend/src/main/java/io/github/evan0x/syllacal/web/SyllabusController.java`,
      },
      request: `POST /api/syllabus
file: notes.docx
courseName: MATH 114
termStart: 2026-01-20
termEnd: 2026-05-08`,
      response: `HTTP 400
{ "message": "File is not a PDF" }`
    },
    {
      id: 'scanned',
      title: 'Stop a scanned PDF',
      method: 'POST',
      path: '/api/syllabus',
      status: '422',
      note: 'Fewer than 200 extracted characters is treated as a scan. OCR is not implemented.',
      source: {
        file: 'PdfTextExtractor.java',
        href: `${src}/backend/src/main/java/io/github/evan0x/syllacal/pdf/PdfTextExtractor.java`,
      },
      request: `POST /api/syllabus
file: photographed-syllabus.pdf
courseName: MATH 114
termStart: 2026-01-20
termEnd: 2026-05-08`,
      response: `HTTP 422
{ "message": "Extracted text is too short (N characters). This is probably a scanned PDF; OCR is not supported yet." }`,
    },
    {
      id: 'missing',
      title: 'Missing fields',
      method: 'POST',
      path: '/api/syllabus',
      status: '400',
      note: 'ApiExceptionHandler maps missing parts and typed date fields to a short message. There is no stack trace in the body.',
      source: {
        file: 'ApiExceptionHandler.java',
        href: `${src}/backend/src/main/java/io/github/evan0x/syllacal/web/ApiExceptionHandler.java`,
      },
      request: `POST /api/syllabus
file: syllabus.pdf`,
      response: `HTTP 400
{ "message": "courseName is required" }

HTTP 400
{ "message": "termStart must be a date in YYYY-MM-DD format" }

HTTP 400
{ "message": "termEnd must be on or after termStart" }

HTTP 400
{ "message": "File exceeds the 10 MB limit" }`
    },
  ],
  snippets: [
    {
      id: 'header',
      file: 'SyllabusController.java',
      href: `${src}/backend/src/main/java/io/github/evan0x/syllacal/web/SyllabusController.java`,
      caption: 'Trust the bytes, not the filename',
      code: `static final long MAX_FILE_BYTES = 10L * 1024 * 1024;
private static final byte[] PDF_MAGIC = "%PDF-".getBytes(StandardCharsets.US_ASCII);

static boolean isPdf(byte[] bytes) {
  if (bytes == null || bytes.length < PDF_MAGIC.length) {
    return false;
  }
  for (int i = 0; i < PDF_MAGIC.length; i++) {
    if (bytes[i] != PDF_MAGIC[i]) {
      return false;
    }
  }
  return true;
}`,
    },
    {
      id: 'scan',
      file: 'PdfTextExtractor.java',
      href: `${src}/backend/src/main/java/io/github/evan0x/syllacal/pdf/PdfTextExtractor.java`,
      caption: 'Fail closed when the extract is too short',
      code: `if (result.length() < MIN_TEXT_LENGTH) {
  throw new ScannedPdfException(
      "Extracted text is too short (" + result.length()
          + " characters). This is probably a scanned PDF; OCR is not supported yet.");
}`,
    },
    {
      id: 'validate',
      file: 'EventValidator.java',
      href: `${src}/backend/src/main/java/io/github/evan0x/syllacal/calendar/EventValidator.java`,
      caption: 'Drop undated events. Keep the rest, with warnings that never leave the server.',
      code: `if (event.date() == null) {
  warnings.add("Dropped event with null date: " + safeTitle(event));
  continue;
}

if (event.date().isBefore(termStart) || event.date().isAfter(termEnd)) {
  warnings.add("Event outside term range [" + termStart + ", " + termEnd + "]: "
      + safeTitle(event) + " on " + event.date());
}

String key = safeTitle(event) + "|" + event.date();
if (byTitleAndDate.containsKey(key)) {
  warnings.add("Merged duplicate event: " + safeTitle(event) + " on " + event.date());
  continue;
}`,
    },
  ],
  beforeAfter: {
    title: 'What the screenshots show vs what the controller returns',
    evidence: 'The three lab frames are from the project. The live static page and SyllabusController are from main.',
    before: {
      label: 'Controller today',
      text: 'POST /api/syllabus returns text/calendar in the same request. The static form shows “Extracting dates…”, then downloads the blob. EventValidator warnings stay on the server. There is no review step in the response.',
    },
    after: {
      label: 'Review frame in the lab',
      text: 'The review screenshot lists exams with edit, delete, add event, and export controls. That UI is not what the current controller serves. The request still ends in a file download.',
    },
  },
  sections: [
    {
      id: 'overview',
      title: 'Overview',
      body: [
        'SyllaCal turns a course syllabus PDF into an .ics file. The README calls it an early-stage demo: upload a PDF, name the course, set the term, download a calendar.',
        'The backend is Java 21 and Spring Boot. Apache PDFBox reads the pages. Gemini generateContent (gemini-3.5-flash-lite in application.yml) returns JSON events. ical4j writes the calendar. There is no database and no user account.',
      ],
    },
    {
      id: 'problem',
      title: 'Problem',
      body: [
        'A syllabus already holds the dates. Getting them into Google Calendar, Apple Calendar, or Outlook still means reading the PDF and typing. Relative phrases such as “Week 5 Friday” only make sense if the term start is known.',
        'The constraint in this demo is honesty about what the file actually contains. The prompt tells the model not to invent dates. Events with no date are dropped. Scanned PDFs are refused instead of being sent to the model as empty text.',
      ],
    },
    {
      id: 'architecture',
      title: 'System Architecture',
      body: [
        'One Spring controller owns the pass. SyllabusController reads the multipart file, extracts text, calls the EventExtractor, validates, and builds the .ics. EventValidator and IcsBuilder are constructed with new inside the controller, not as Spring beans.',
        'GeminiEventExtractor is the only EventExtractor implementation. RelativeDateResolver exists in the repo, but resolve() still throws TODO and is never called. Dockerfile and Kubernetes files are unused sketches.',
      ],
    },
    {
      id: 'stack',
      title: 'Technology Stack',
      items: [
        'Java 21 and Spring Boot, with a single POST /api/syllabus endpoint.',
        'Apache PDFBox 3.0.8 for Loader.loadPDF and PDFTextStripper.',
        'Gemini generateContent via Spring RestClient. The API key is GEMINI_API_KEY. The model name is set in application.yml to gemini-3.5-flash-lite.',
        'ical4j 4.4.0 for VEVENT output as text/calendar.',
        'A static index.html form that posts FormData and downloads the blob.',
      ],
    },
    {
      id: 'backend',
      title: 'Backend Design',
      body: [
        'The web layer is small on purpose: SyllabusController, ApiError, SyllabusRequestException, and ApiExceptionHandler. PdfTextExtractor, GeminiEventExtractor, EventValidator, and IcsBuilder sit behind that.',
        'Request checks happen before PDFBox opens the file: empty file, size over 10 MB, missing course name, missing or inverted term dates, bytes that are not %PDF-. Encrypted PDFs fail when PDFBox loads the document and are mapped to “Encrypted PDFs are not supported.”',
      ],
    },
    {
      id: 'api',
      title: 'API Design',
      body: [
        'There is one write endpoint. The contract is multipart in, calendar out. Errors are JSON { "message": "..." }. Success is not JSON.',
        '422 is used for scanned PDFs and extraction failures. 400 is used for missing fields, type mismatches, non-PDFs, and the 10 MB cap. Validator warnings are not a field on either response.',
      ],
    },
    {
      id: 'pipeline',
      title: 'Data Processing Pipeline',
      body: [
        'PDFBox strips text page by page, with a blank line between pages. If the extract is under 200 characters, ScannedPdfException stops the request.',
        'Gemini is asked for a list of events: title, type, date, optional time, weight, confidence, and a short source quote. Temperature is 0. Thought parts are skipped; only text parts are kept. HTTP 429 and 5xx retry up to three times with exponential backoff starting at 200 ms.',
        'EventValidator then drops null dates, merges title|date duplicates in a LinkedHashMap, and records out-of-term and LOW confidence events as warnings without removing them. IcsBuilder writes all-day dates or UTC date-times. There is no timezone field on the form and no end time on events. UIDs are name-based UUIDs from course, title, and date.',
      ],
    },
    {
      id: 'errors',
      title: 'Error Handling and Validation',
      body: [
        'ApiExceptionHandler is a @RestControllerAdvice. SyllabusRequestException keeps its own status. ScannedPdfException and ExtractionException become 422. MaxUploadSizeExceededException becomes “File exceeds the 10 MB limit.” Missing file becomes “A PDF file is required.” Date fields that are not YYYY-MM-DD become a typed error.',
        'The page shows body.message when the response is not ok. It does not surface validator warnings, because those never leave the server.',
      ],
    },
    {
      id: 'challenges',
      title: 'Engineering Challenges',
      items: [
        'Relative dates are interpreted only by the model, using term start and end in the prompt. RelativeDateResolver is a stub.',
        'Scanned syllabi have no OCR path. The extractor fails fast under 200 characters.',
        'Gemini can return undated or duplicate events. The validator cleans the list after the model, not during the prompt.',
        'Warnings exist on ValidationResult and are not shown to the person who uploaded the file.',
        'Term.overlaps, contains, and getDurationInDays are unimplemented, and their tests fail. They are not on the request path.',
      ],
    },
    {
      id: 'decisions',
      title: 'Technical Decisions',
      items: [
        'Header bytes over filename, so a renamed .txt does not pass as a syllabus.',
        'JSON schema plus temperature 0, instead of asking the model to emit .ics directly.',
        'Keep out-of-term and LOW confidence events rather than silently deleting them.',
        'UTC and all-day fallbacks instead of a timezone picker this demo does not have.',
        'One request, one file. No queue, no review payload, no stored syllabus.',
      ],
    },
    {
      id: 'future',
      title: 'Future Improvements',
      body: [
        'These are gaps in the current source, not a roadmap with dates.',
      ],
      items: [
        'Implement RelativeDateResolver.resolve() and call it, or delete the unused class.',
        'Return validator warnings to the browser, or drop them if they will never be shown.',
        'A review step that matches the edit/delete/add screenshot, if that UI is the next surface.',
        'OCR, or a clearer scanned-PDF message that stays the only path.',
        'Timezone and event end times, if the calendar is meant to be more than all-day UTC.',
        'Finish or remove Term.overlaps / contains / getDurationInDays so the test suite matches the product.',
      ],
    },
  ],
};
