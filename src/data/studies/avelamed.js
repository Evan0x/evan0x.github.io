const src = 'https://github.com/Evan0x/MED/blob/main/hackathon-v1';

export const avelamedStudy = {
  id: 'avelamed',
  number: '02',
  name: 'Avelamed',
  kicker: 'Field system',
  category: 'AI / Healthcare Workflow',
  stage: 'Vite app in hackathon-v1. Live at avelamed.vercel.app.',
  repo: 'https://github.com/Evan0x/MED',
  live: 'https://avelamed.vercel.app/',
  stack: ['React 19', 'Vite 8', 'React Router 7', 'Clerk', 'Supabase', 'Google Maps', 'Gemini 2.5 Flash'],
  links: [
    { label: 'Live site', href: 'https://avelamed.vercel.app/' },
    { label: 'Repository', href: 'https://github.com/Evan0x/MED' },
    { label: 'Results.jsx', href: `${src}/src/Pages/Results.jsx` },
  ],
  architecture: {
    kicker: 'Click a stage',
    lede: 'Search is a map problem. Ranking is a local scoring problem. Chat is a separate Vercel function.',
    nodes: [
      {
        id: 'landing',
        label: 'Landing search',
        plain: 'The home page takes a typed location or Find Me, then routes into Results.',
        responsibility: 'Hold the search bar, well-being mode, and the floating AvelaAI widget. Resetting the app remounts the routed tree so Landing state does not survive a fake navigation to /.',
        technology: 'React Router · Landing.jsx · AppResetContext',
        decision: 'Page state lives in the pages. Bumping resetKey remounts the tree because going to “/” while already on “/” would keep Landing mounted.',
        source: { file: 'App.jsx', href: `${src}/src/App.jsx` },
        snippet: `// Bumping resetKey remounts the whole routed tree, which clears
// search, map markers, and the chatbot in one pass.`,
      },
      {
        id: 'places',
        label: 'Google Places',
        plain: 'Results asks Places for nearby locations in curated Get Well and Stay Well categories.',
        responsibility: 'Load the Maps script, run nearbySearch per category, then optionally placeDetails for the cards that will be shown.',
        technology: 'Maps JavaScript API · Places Service · googleMaps.js',
        decision: 'Categories are fixed lists (pharmacy, ER, dentist, clinic, and the Stay Well set). This is not an open-ended Places text search.',
        source: { file: 'Results.jsx', href: `${src}/src/Pages/Results.jsx` },
        snippet: `function nearbySearchPromise(service, params) {
  return new Promise((resolve) => {
    service.nearbySearch(params, (results, status) => {
      resolve({ results: results ?? [], status });
    });
  });
}`,
      },
      {
        id: 'rank',
        label: 'Bayesian rank',
        plain: 'Each place gets a shrunk rating, then a weighted score with distance, open-now, and price.',
        responsibility: 'Compute Best Overall from overallScore. A second card follows the selected sort: nearest, cheapest, highest rating, most reviewed, or insurance-friendly.',
        technology: 'bayesianRating · overallScore · Results.jsx',
        decision: 'Insurance is a sort heuristic on the place name, not a term in the default score. Distance in that score is the Places result index, because nearbySearch already returns results by proximity.',
        source: { file: 'Results.jsx', href: `${src}/src/Pages/Results.jsx` },
        snippet: `return ratingScore * 0.50 + distanceScore * 0.30
     + openBonus * 0.12 + priceScore * 0.08;`,
      },
      {
        id: 'chat',
        label: 'AvelaAI',
        plain: 'A floating chat posts the thread to /api/chat. Gemini 2.5 Flash answers on the server.',
        responsibility: 'Cap the thread, attach a long system prompt, and return { reply }. Signed-out visitors can use it. Emergencies are instructed to call 911 before anything else.',
        technology: 'Vercel function · gemini-2.5-flash · Healthchatbot.jsx',
        decision: 'The key stays on the server as GEMINI_API_KEY. The browser calls /api/chat through apiPost, which adds a Clerk bearer token when a session exists.',
        source: { file: 'api/chat.js', href: `${src}/api/chat.js` },
        snippet: `const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const MAX_MESSAGES = 40;
const MAX_CHARS = 4000;`,
      },
      {
        id: 'profile',
        label: 'Health profile',
        plain: 'A signed-in passport stores medical fields in Supabase, keyed by Clerk user id.',
        responsibility: 'Read and write health_profiles. Export a PDF with jsPDF. Share a read-only overview from a QR code.',
        technology: 'Clerk · Supabase · jsPDF · qrcode.react',
        decision: 'The table is keyed on user_id as the Clerk id. README documents RLS so a user only touches their own row.',
        source: { file: 'HealthProfile.jsx', href: `${src}/src/Pages/HealthProfile.jsx` },
      },
    ],
  },
  flow: {
    lede: 'Places results are scored in the browser. Chat never sees the map.',
    steps: [
      { id: 'locate', label: 'Locate', detail: 'Typed place or Find Me' },
      { id: 'search', label: 'Search', detail: 'nearbySearch per category' },
      { id: 'score', label: 'Score', detail: '0.50 / 0.30 / 0.12 / 0.08' },
      { id: 'cards', label: 'Cards', detail: 'Best Overall + sort pick' },
      { id: 'assist', label: 'Assist', detail: 'POST /api/chat' },
    ],
  },
  apis: [
    {
      id: 'chat',
      title: 'AvelaAI reply',
      method: 'POST',
      path: '/api/chat',
      status: '200',
      note: 'Open to signed-out visitors. Messages must be user|assistant strings, at most 40 items, 4000 characters each.',
      source: { file: 'api/chat.js', href: `${src}/api/chat.js` },
      request: `POST /api/chat
Content-Type: application/json
Authorization: Bearer <Clerk session, if signed in>

{
  "messages": [
    { "role": "user", "content": "What is ibuprofen generally used for?" }
  ]
}`,
      response: `HTTP 200
{ "reply": "..." }`,
    },
    {
      id: 'chat-invalid',
      title: 'Reject a bad thread',
      method: 'POST',
      path: '/api/chat',
      status: '400',
      note: 'The function does not call Gemini unless the payload passes the cap checks.',
      source: { file: 'api/chat.js', href: `${src}/api/chat.js` },
      request: `POST /api/chat
{ "messages": "not-an-array" }`,
      response: `HTTP 400
{ "error": "Invalid messages." }

HTTP 500
{ "error": "Chat is not configured on the server." }

HTTP 502
{ "error": "The assistant is unavailable right now." }`,
    },
    {
      id: 'client',
      title: 'Browser helper',
      method: 'POST',
      path: '/api/{path}',
      status: '4xx/5xx',
      note: 'apiPost always sends JSON. A Clerk session token is included when window.Clerk.session exists. Failures throw with the server error string.',
      source: { file: 'src/api.js', href: `${src}/src/api.js` },
      request: `const token = await window.Clerk?.session?.getToken();
fetch('/api/' + path, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: 'Bearer ' + token } : {}),
  },
  body: JSON.stringify(body),
});`,
      response: `if (!res.ok) throw new Error(data.error || 'Request failed (' + res.status + ')');
return data;`,
    },
  ],
  snippets: [
    {
      id: 'bayes',
      file: 'Results.jsx',
      href: `${src}/src/Pages/Results.jsx`,
      caption: 'Shrink noisy ratings toward the pool mean before weighting',
      code: `function bayesianRating(rating, reviewCount, poolMeanRating, confidenceThreshold) {
  const v = reviewCount ?? 0;
  const R = rating ?? 0;
  return (v * R + confidenceThreshold * poolMeanRating) / (v + confidenceThreshold);
}

function overallScore(place, index, total, { meanRating, meanReviews }) {
  const adjRating = bayesianRating(place.rating, place.user_ratings_total, meanRating, meanReviews);
  const ratingScore = adjRating / 5;
  const distanceScore = total > 1 ? 1 - index / (total - 1) : 1;
  const openBonus = place.opening_hours?.open_now ? 1 : 0;
  const priceScore = place.price_level != null ? (4 - place.price_level) / 4 : 0.5;
  return ratingScore * 0.50 + distanceScore * 0.30 + openBonus * 0.12 + priceScore * 0.08;
}`,
    },
    {
      id: 'prompt',
      file: 'api/chat.js',
      href: `${src}/api/chat.js`,
      caption: 'Emergencies occupy the first line. The model is told not to diagnose or dose.',
      code: `1. EMERGENCIES COME FIRST. If anything suggests a medical emergency
   ... make that your entire first line: tell them to call their local
   emergency number (911 in the US) ...
3. Never diagnose.
4. Never prescribe, and never give or confirm a specific dose.`,
    },
  ],
  beforeAfter: {
    title: 'README feature list vs the live scoring function',
    evidence: 'Both files are in the same repository. The ranking section of the README already prints the four-term formula; the Features blurb still mentions insurance inside the model.',
    before: {
      label: 'Features blurb',
      text: 'The README features list describes “a Bayesian ranking model that balances rating, distance, price, insurance likelihood, and open now status.”',
    },
    after: {
      label: 'overallScore in Results.jsx',
      text: 'The function is 0.50 rating (Bayesian-adjusted), 0.30 distance index, 0.12 open-now, 0.08 price. Insurance is a separate sort: calculateInsuranceScore scans the place name for keywords such as medicare, medicaid, hmo, ppo, and in-network.',
    },
  },
  sections: [
    {
      id: 'overview',
      title: 'Overview',
      body: [
        'Avelamed (repo: MED, branded Avela in the README) is a location-aware care-finding app: map results, a health passport, and AvelaAI in the same product. The Vite app lives in hackathon-v1. The live site is avelamed.vercel.app.',
        'Get Well and Stay Well split the category lists. Clerk handles identity. Health profiles sit in Supabase. Maps and Places run in the browser. Chat, translate, and speech are Vercel functions under api/.',
      ],
    },
    {
      id: 'problem',
      title: 'Problem',
      body: [
        'A Places list is unordered care. People still have to guess which clinic to try, and a separate chatbot would lose the map context of the session even if it cannot see coordinates.',
        'The product constraint is ranking plus a non-prescriptive assistant. The assistant is instructed not to diagnose, not to dose, and to send emergencies to 911 on the first line.',
      ],
    },
    {
      id: 'architecture',
      title: 'System Architecture',
      body: [
        'The SPA routes are /, results, health profile, and a read-only profile overview. AuthHeader wraps Clerk’s signed-in and signed-out states.',
        'Ranking is client-side over Google Places payloads. Gemini is not in that loop. Chat is POST /api/chat with the key on the server.',
      ],
    },
    {
      id: 'stack',
      title: 'Technology Stack',
      items: [
        'React 19, Vite 8, React Router 7.',
        'Clerk for sign-in and the session token apiPost forwards.',
        'Supabase for health_profiles keyed on Clerk user_id.',
        'Google Maps JavaScript API and Places Service.',
        'Gemini 2.5 Flash in api/chat.js. Sibling functions: api/translate.js and api/speech.js.',
        'jsPDF and qrcode.react for export and share.',
        'Vercel, with SPA rewrites in hackathon-v1/vercel.json.',
      ],
    },
    {
      id: 'backend',
      title: 'Backend Design',
      body: [
        'There is no custom application server. Browser code talks to Clerk, Supabase, Maps, and three Vercel functions. api/_lib holds shared HTTP helpers.',
        'Chat is the one function inspected in full: it requires GEMINI_API_KEY, validates the messages array, and maps Gemini HTTP failures to 502. It is intentionally usable while signed out.',
      ],
    },
    {
      id: 'api',
      title: 'API Design',
      body: [
        'The browser helper is one function: apiPost(path, body) → /api/{path}. Chat’s contract is { messages } in, { reply } or { error } out.',
        'Places is not an app-owned REST API. nearbySearch and placeDetails are Google callbacks wrapped in Promises inside Results.jsx.',
      ],
    },
    {
      id: 'pipeline',
      title: 'Data Processing Pipeline',
      body: [
        'For each curated category, Results runs nearbySearch, then scores the filtered list. bayesianRating shrinks a place’s star rating toward the pool mean, using the pool’s mean review count as the confidence threshold.',
        'distanceScore is 1 minus the item’s index in that list, so it inherits Places’ proximity order instead of computing meters in the weighted sum.',
        'Best Overall is the highest overallScore. The second card is a different place chosen by the active sort. Missing photos fall back to a category emoji.',
      ],
    },
    {
      id: 'errors',
      title: 'Error Handling and Validation',
      body: [
        'apiPost throws on a non-OK response using data.error. Chat rejects malformed threads with 400, a missing key with 500, and an upstream Gemini failure with 502.',
        'The chat system prompt is the safety layer for medical content: emergencies first, no diagnosis, no personal dose. The widget also keeps a 911 disclaimer in the UI.',
      ],
    },
    {
      id: 'challenges',
      title: 'Engineering Challenges',
      items: [
        'Places ratings are noisy when the review count is small. Bayesian shrinkage is the local answer, not a second model.',
        'Insurance is not in the Places payload. The sort uses name keywords, which is a heuristic, not coverage data.',
        'Chat has no memory of labs or the health profile. The prompt says so explicitly.',
        'Repo docs still mention hackathon v.1 with a space. The tree on main is hackathon-v1.',
      ],
    },
    {
      id: 'decisions',
      title: 'Technical Decisions',
      items: [
        'Rank in the client from Places fields, instead of a custom search index.',
        'Keep Gemini off the ranking path so a chat outage does not blank the map.',
        'Allow unsigned chat, with caps, because the widget sits on the landing page.',
        'Store the passport under Clerk user_id rather than duplicating identity in Supabase Auth.',
      ],
    },
    {
      id: 'future',
      title: 'Future Improvements',
      body: ['Taken from mismatches and comments already in the repo, not from unused product ideas.'],
      items: [
        'Move insurance language out of the ranking feature blurb, or put a real insurance signal in overallScore.',
        'Replace index-based distanceScore with an actual distance if the UI starts claiming meters.',
        'Align README paths with hackathon-v1.',
        'Decide whether chat should stay anonymous or require a session now that profiles are signed-in.',
      ],
    },
  ],
};
