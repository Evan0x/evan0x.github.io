const repo = 'https://github.com/Evan0x/SyllaCal/blob/main';

export const syllacalArchitecture = [
  {
    id: 'pdf-upload',
    label: 'PDF Upload',
    plain: 'The page sends one syllabus PDF, a course name, and the term start and end dates to the server.',
    responsibility:
      'Accept the form, reject empty or oversized files, and refuse anything that is not a PDF. The course name and term bounds have to be present before any extraction starts.',
    technology: 'Spring Boot · MultipartFile · POST /api/syllabus',
    decision:
      'The file is checked by its %PDF- header, not by the file name. Files over 10 MB are rejected. Encrypted PDFs fail later, when PDFBox tries to open them.',
    source: {
      file: 'SyllabusController.java',
      href: `${repo}/backend/src/main/java/io/github/evan0x/syllacal/web/SyllabusController.java`,
    },
    snippet: `static final long MAX_FILE_BYTES = 10L * 1024 * 1024;
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
    id: 'pdfbox',
    label: 'Apache PDFBox',
    plain: 'The server opens the PDF as a document, not as a picture of pages.',
    responsibility:
      'Load the bytes with PDFBox and refuse encrypted files before any text is read.',
    technology: 'Apache PDFBox · Loader.loadPDF · PDDocument',
    decision:
      'Encryption is treated as unreadable. The controller maps that failure to “Encrypted PDFs are not supported.” There is no password path.',
    source: {
      file: 'PdfTextExtractor.java',
      href: `${repo}/backend/src/main/java/io/github/evan0x/syllacal/pdf/PdfTextExtractor.java`,
    },
    snippet: `try (PDDocument document = Loader.loadPDF(bytes)) {
  if (document.isEncrypted()) {
    throw new IOException("Encrypted PDFs are not supported");
  }`,
  },
  {
    id: 'text-extraction',
    label: 'Text Extraction',
    plain: 'Each page becomes text. Pages are kept apart by a blank line so the model can still see page breaks.',
    responsibility:
      'Strip text page by page with PDFTextStripper. If fewer than 200 characters come back, stop — that is treated as a scanned PDF.',
    technology: 'PDFTextStripper · ScannedPdfException',
    decision:
      'OCR is not implemented. A short extract fails fast instead of sending a blank syllabus to Gemini. This lives in the same PdfTextExtractor.extract() method that loaded the document.',
    source: {
      file: 'PdfTextExtractor.java',
      href: `${repo}/backend/src/main/java/io/github/evan0x/syllacal/pdf/PdfTextExtractor.java`,
    },
    snippet: `PDFTextStripper stripper = new PDFTextStripper();
StringBuilder text = new StringBuilder();
int pages = document.getNumberOfPages();
for (int page = 1; page <= pages; page++) {
  stripper.setStartPage(page);
  stripper.setEndPage(page);
  if (page > 1) {
    text.append("\\n\\n");
  }
  text.append(stripper.getText(document).trim());
}
String result = text.toString().trim();
if (result.length() < MIN_TEXT_LENGTH) {
  throw new ScannedPdfException(
      "Extracted text is too short (" + result.length()
          + " characters). This is probably a scanned PDF; OCR is not supported yet.");
}`,
  },
  {
    id: 'gemini-api',
    label: 'Gemini API',
    plain: 'The extracted text is sent to Gemini. The model is asked to find graded work and exam dates, not to write a calendar file yet.',
    responsibility:
      'Call Gemini generateContent through Spring RestClient. Retry HTTP 429 and 5xx up to three times with exponential backoff starting at 200 ms.',
    technology: 'Gemini generateContent · gemini-3.5-flash-lite · RestClient',
    decision:
      'GeminiEventExtractor is the only EventExtractor implementation. The API key comes from GEMINI_API_KEY. The model name is set in application.yml. Thought parts in the response are skipped; only text parts are kept.',
    source: {
      file: 'GeminiEventExtractor.java',
      href: `${repo}/backend/src/main/java/io/github/evan0x/syllacal/extraction/GeminiEventExtractor.java`,
    },
    snippet: `return restClient.post()
    .uri("/v1beta/models/{model}:generateContent", model)
    .header("x-goog-api-key", apiKey)
    .contentType(MediaType.APPLICATION_JSON)
    .accept(MediaType.APPLICATION_JSON)
    .body(requestBody)
    .exchange((request, response) -> {
      int status = response.getStatusCode().value();
      if (status == 429 || response.getStatusCode().is5xxServerError()) {
        throw new RetryableGeminiException("Gemini API returned HTTP " + status);
      }
      byte[] bytes = response.getBody().readAllBytes();
      String body = new String(bytes, StandardCharsets.UTF_8);
      if (response.getStatusCode().isError()) {
        throw new ExtractionException("Gemini API returned HTTP " + status);
      }
      return body;
    });`,
  },
  {
    id: 'structured-extraction',
    label: 'Structured Event Extraction',
    plain: 'Gemini has to answer as a list of events: a title, a type, a date, an optional time, a weight, a confidence, and a short quote from the syllabus.',
    responsibility:
      'Force JSON with a response schema, then parse it into ExtractedEvent records. The prompt tells the model to turn “Week 5 Friday” into a date using the term start, and never to invent dates.',
    technology: 'responseMimeType: application/json · ExtractedEvent · extract-events.txt',
    decision:
      'Temperature is 0. The schema requires title, type, date, time, weight_percent, confidence, and source_text. Date and time may be null. RelativeDateResolver exists in the repo, but resolve() still throws TODO and is never called. Relative dates are interpreted only by the model, using the term start and end in the prompt.',
    source: {
      file: 'GeminiEventExtractor.java',
      href: `${repo}/backend/src/main/java/io/github/evan0x/syllacal/extraction/GeminiEventExtractor.java`,
    },
    snippet: `generationConfig.put("temperature", 0);
generationConfig.put("thinkingConfig", Map.of("thinkingLevel", "minimal"));
generationConfig.put("responseMimeType", "application/json");
generationConfig.put("responseSchema", responseSchema());

// Prompt rule from extract-events.txt:
// Convert relative dates ("Week 5 Friday") into absolute dates
// using the term start. Never invent dates.`,
  },
  {
    id: 'event-validation',
    label: 'Event Validation',
    plain: 'The model’s list is cleaned before a calendar is written. Events with no date are removed.',
    responsibility:
      'Drop any event whose date is null. Events outside the term, and events marked LOW confidence, stay in the list — they only add a warning.',
    technology: 'EventValidator.validate · ValidationResult',
    decision:
      'Out-of-term and low-confidence events are kept. Warnings are recorded on ValidationResult and are not returned to the browser or written into the .ics file. EventValidator is constructed with new inside SyllabusController, not as a Spring bean.',
    source: {
      file: 'EventValidator.java',
      href: `${repo}/backend/src/main/java/io/github/evan0x/syllacal/calendar/EventValidator.java`,
    },
    snippet: `if (event.date() == null) {
  warnings.add("Dropped event with null date: " + safeTitle(event));
  continue;
}

if (event.date().isBefore(termStart) || event.date().isAfter(termEnd)) {
  warnings.add("Event outside term range [" + termStart + ", " + termEnd + "]: "
      + safeTitle(event) + " on " + event.date());
}

if ("LOW".equalsIgnoreCase(event.confidence())) {
  warnings.add("LOW confidence event kept: " + safeTitle(event)
      + " on " + event.date());
}`,
  },
  {
    id: 'duplicate-merging',
    label: 'Duplicate Merging',
    plain: 'If two events share the same title and the same date, only the first one is kept.',
    responsibility:
      'Key events by title and date in a LinkedHashMap. A later event with the same key is skipped and logged as a merge warning.',
    technology: 'EventValidator · LinkedHashMap',
    decision:
      'This is the same validate() pass as the null-date drop, not a separate service. Order is preserved. The merge warning, like the others, is not shown on the page.',
    source: {
      file: 'EventValidator.java',
      href: `${repo}/backend/src/main/java/io/github/evan0x/syllacal/calendar/EventValidator.java`,
    },
    snippet: `String key = safeTitle(event) + "|" + event.date();
if (byTitleAndDate.containsKey(key)) {
  warnings.add("Merged duplicate event: " + safeTitle(event)
      + " on " + event.date());
  continue;
}
byTitleAndDate.put(key, event);`,
  },
  {
    id: 'ical4j',
    label: 'ical4j',
    plain: 'The cleaned events become a standard calendar document.',
    responsibility:
      'Build a VEVENT for each remaining event. No time means an all-day date. A time is stored as a UTC date-time. The description can include the weight and the source quote.',
    technology: 'ical4j · VEvent · Calendar',
    decision:
      'IcsBuilder.build(events, courseName) always uses ZoneId.of("UTC"). The form has no timezone field. Events do not get an end time. UIDs are stable name-based UUIDs from course, title, and date. IcsBuilder is also constructed with new in the controller.',
    source: {
      file: 'IcsBuilder.java',
      href: `${repo}/backend/src/main/java/io/github/evan0x/syllacal/calendar/IcsBuilder.java`,
    },
    snippet: `if (event.time() == null) {
  vevent = new VEvent(event.date(), summary);
} else {
  ZonedDateTime start = ZonedDateTime.of(event.date(), event.time(), timeZone);
  vevent = new VEvent(start, summary);
}
vevent.add(new Uid(stableUid(courseName, event.title(), event.date())));
vevent.add(new Description(buildDescription(event)));`,
  },
  {
    id: 'ics-download',
    label: 'ICS Download',
    plain: 'The browser receives a .ics file and saves it. That file can be opened in Google Calendar, Apple Calendar, or Outlook.',
    responsibility:
      'Return text/calendar with a Content-Disposition filename derived from the course name. The page turns the response into a download.',
    technology: 'Content-Disposition · text/calendar · FormData fetch',
    decision:
      'The controller returns the file in the same request. The static page posts the form, shows “Extracting dates…”, then saves the blob. Validator warnings never leave the server.',
    source: {
      file: 'static/index.html',
      href: `${repo}/backend/src/main/resources/static/index.html`,
    },
    snippet: `String ics = icsBuilder.build(validated.validEvents(), course);
return ResponseEntity.ok()
    .contentType(MediaType.parseMediaType("text/calendar"))
    .header("Content-Disposition", disposition.toString())
    .body(ics);

const blob = await response.blob();
const match = header.match(/filename="([^"]+)"/);
link.download = match ? match[1] : "syllabus.ics";
link.click();`,
  },
];
