import { profile } from '../data/site.js';

export const GITHUB_USER = new URL(profile.github).pathname.replaceAll('/', '');
const API = 'https://api.github.com';
const CACHE_KEY = 'evan-systems-github-v2';
const CACHE_TTL_MS = 45 * 60 * 1000;
const HEADERS = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};

export function readGithubCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw);
    if (!cached?.data || typeof cached.savedAt !== 'number') return null;
    return cached;
  } catch {
    return null;
  }
}

export function writeGithubCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data }));
  } catch {
    // Quota or private mode — live data still works.
  }
}

export function cacheIsFresh(cached) {
  return Boolean(cached && Date.now() - cached.savedAt < CACHE_TTL_MS);
}

async function githubGet(path) {
  const response = await fetch(`${API}${path}`, { headers: HEADERS });
  if (response.status === 403 || response.status === 429) {
    throw new Error('GitHub rate limit reached. Try again in a little while.');
  }
  if (!response.ok) {
    throw new Error(`GitHub request failed (${response.status}).`);
  }
  return response.json();
}

async function fetchAllRepos(user) {
  const repos = [];
  for (let page = 1; page <= 4; page += 1) {
    const batch = await githubGet(
      `/users/${user}/repos?per_page=100&type=owner&sort=updated&direction=desc&page=${page}`
    );
    if (!Array.isArray(batch) || batch.length === 0) break;
    repos.push(...batch);
    if (batch.length < 100) break;
  }
  return repos;
}

async function mapPool(items, limit, mapper) {
  const results = new Array(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await mapper(items[index]);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

function mergeLanguageBytes(maps) {
  const totals = {};
  for (const map of maps) {
    if (!map) continue;
    for (const [name, bytes] of Object.entries(map)) {
      if (typeof bytes !== 'number' || bytes <= 0) continue;
      totals[name] = (totals[name] || 0) + bytes;
    }
  }
  const total = Object.values(totals).reduce((sum, value) => sum + value, 0);
  if (!total) return [];
  return Object.entries(totals)
    .map(([name, bytes]) => ({
      name,
      bytes,
      share: bytes / total,
    }))
    .sort((a, b) => b.bytes - a.bytes);
}

function normalizeRepo(repo) {
  return {
    id: repo.id,
    name: repo.name,
    description: repo.description || '',
    language: repo.language || '',
    stars: repo.stargazers_count || 0,
    forks: repo.forks_count || 0,
    updatedAt: repo.pushed_at || repo.updated_at,
    htmlUrl: repo.html_url,
    fork: Boolean(repo.fork),
    archived: Boolean(repo.archived),
    homepage: repo.homepage || '',
  };
}

function eventLabel(event) {
  const repo = event.repo?.name || 'a repository';
  const payload = event.payload || {};

  switch (event.type) {
    case 'PushEvent': {
      const count = payload.size || payload.commits?.length || 0;
      return count
        ? `Pushed ${count} commit${count === 1 ? '' : 's'} to ${repo}`
        : `Pushed to ${repo}`;
    }
    case 'CreateEvent':
      return payload.ref_type === 'repository'
        ? `Created ${repo}`
        : `Created ${payload.ref_type || 'ref'} on ${repo}`;
    case 'DeleteEvent':
      return `Deleted ${payload.ref_type || 'ref'} on ${repo}`;
    case 'ForkEvent':
      return `Forked ${repo}`;
    case 'WatchEvent':
      return `Starred ${repo}`;
    case 'PublicEvent':
      return `Made ${repo} public`;
    case 'IssuesEvent':
      return `${payload.action || 'Updated'} an issue on ${repo}`;
    case 'IssueCommentEvent':
      return `Commented on an issue in ${repo}`;
    case 'PullRequestEvent':
      return `${payload.action || 'Updated'} a pull request on ${repo}`;
    case 'PullRequestReviewEvent':
      return `Reviewed a pull request on ${repo}`;
    case 'ReleaseEvent':
      return `Published a release on ${repo}`;
    default:
      return `${event.type.replace(/Event$/, '')} on ${repo}`;
  }
}

function normalizeEvent(event) {
  return {
    id: event.id,
    type: event.type,
    label: eventLabel(event),
    repo: event.repo?.name || '',
    url: event.repo?.name ? `https://github.com/${event.repo.name}` : profile.github,
    at: event.created_at,
  };
}

export async function loadGithubDashboard() {
  const user = GITHUB_USER;
  const [account, reposRaw, eventsRaw] = await Promise.all([
    githubGet(`/users/${user}`),
    fetchAllRepos(user),
    githubGet(`/users/${user}/events/public?per_page=30`),
  ]);

  const repos = reposRaw.map(normalizeRepo);
  const languageTargets = reposRaw.filter((repo) => !repo.fork && !repo.archived);
  const languageMaps = await mapPool(languageTargets, 4, (repo) =>
    githubGet(`/repos/${user}/${repo.name}/languages`).catch(() => null)
  );

  return {
    profile: {
      login: account.login,
      name: account.name || account.login,
      avatar: account.avatar_url,
      htmlUrl: account.html_url,
      publicRepos: account.public_repos,
      followers: account.followers,
      following: account.following,
    },
    repos,
    languages: mergeLanguageBytes(languageMaps),
    activity: Array.isArray(eventsRaw) ? eventsRaw.slice(0, 12).map(normalizeEvent) : [],
    fetchedAt: new Date().toISOString(),
  };
}
