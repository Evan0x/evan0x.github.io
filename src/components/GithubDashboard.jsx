import { useMemo, useState } from 'react';
import { useGithubDashboard } from '../github/useGithubDashboard.js';
import { m, revealProps, useMotionPrefs } from '../motion/MotionProvider.jsx';
import { Section } from './Section.jsx';
import './GithubDashboard.css';

const dateFmt = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

function formatDate(iso) {
  if (!iso) return 'Unknown';
  return dateFmt.format(new Date(iso));
}

function formatShare(share) {
  const pct = share * 100;
  if (pct >= 10) return `${Math.round(pct)}%`;
  if (pct >= 1) return `${pct.toFixed(1)}%`;
  return '<1%';
}

function formatCount(value) {
  return new Intl.NumberFormat('en-US').format(value);
}

function Skeleton({ className }) {
  return <span className={className ? `gh-skel ${className}` : 'gh-skel'} aria-hidden="true" />;
}

function DashboardSkeleton() {
  return (
    <div className="gh-board" aria-hidden="true">
      <div className="gh-profile">
        <Skeleton className="gh-skel-avatar" />
        <div className="gh-profile-copy">
          <Skeleton className="gh-skel-line gh-skel-line--wide" />
          <Skeleton className="gh-skel-line" />
        </div>
        <div className="gh-stats">
          <Skeleton className="gh-skel-stat" />
          <Skeleton className="gh-skel-stat" />
          <Skeleton className="gh-skel-stat" />
        </div>
      </div>
      <div className="gh-split">
        <div className="gh-panel">
          <Skeleton className="gh-skel-line" />
          <Skeleton className="gh-skel-row" />
          <Skeleton className="gh-skel-row" />
          <Skeleton className="gh-skel-row" />
        </div>
        <div className="gh-panel">
          <Skeleton className="gh-skel-line" />
          <Skeleton className="gh-skel-bar" />
          <Skeleton className="gh-skel-bar" />
          <Skeleton className="gh-skel-bar" />
        </div>
      </div>
    </div>
  );
}

function ProfileCard({ profile }) {
  return (
    <article className="gh-profile">
      <img
        className="gh-avatar"
        src={profile.avatar}
        alt={`${profile.login} avatar`}
        width="72"
        height="72"
        referrerPolicy="no-referrer"
      />
      <div className="gh-profile-copy">
        <p className="gh-login">{profile.login}</p>
        <p>{profile.name}</p>
        <a className="text-link" href={profile.htmlUrl} target="_blank" rel="noreferrer">
          Open profile <span aria-hidden="true">↗</span>
        </a>
      </div>
      <dl className="gh-stats">
        <div>
          <dt>Repos</dt>
          <dd>{formatCount(profile.publicRepos)}</dd>
        </div>
        <div>
          <dt>Followers</dt>
          <dd>{formatCount(profile.followers)}</dd>
        </div>
        <div>
          <dt>Following</dt>
          <dd>{formatCount(profile.following)}</dd>
        </div>
      </dl>
    </article>
  );
}

function RepoList({ repos }) {
  const [sort, setSort] = useState('updated');
  const [language, setLanguage] = useState('all');
  const languages = useMemo(() => {
    const names = new Set(repos.map((repo) => repo.language).filter(Boolean));
    return [...names].sort((a, b) => a.localeCompare(b));
  }, [repos]);

  const visible = useMemo(() => {
    const filtered = language === 'all' ? repos : repos.filter((repo) => repo.language === language);
    const next = [...filtered];
    if (sort === 'stars') {
      next.sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name));
    } else {
      next.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }
    return next;
  }, [repos, sort, language]);

  return (
    <div className="gh-panel">
      <div className="gh-panel-head">
        <p className="kicker">
          <span className="kicker-index">01</span>
          Repositories
        </p>
        <div className="gh-controls">
          <label>
            Sort
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="updated">Recently updated</option>
              <option value="stars">Stars</option>
            </select>
          </label>
          <label>
            Language
            <select value={language} onChange={(event) => setLanguage(event.target.value)}>
              <option value="all">All</option>
              {languages.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      {visible.length === 0 ? (
        <p className="gh-empty">No public repositories match that filter.</p>
      ) : (
        <ul className="gh-repos">
          {visible.map((repo) => (
            <li key={repo.id}>
              <a className="gh-repo" href={repo.htmlUrl} target="_blank" rel="noreferrer">
                <div className="gh-repo-top">
                  <strong>{repo.name}</strong>
                  <span>{repo.language || 'No language'}</span>
                </div>
                <p>{repo.description || 'No description on GitHub.'}</p>
                <div className="gh-repo-meta">
                  <span>★ {formatCount(repo.stars)}</span>
                  <span>Forks {formatCount(repo.forks)}</span>
                  <span>Updated {formatDate(repo.updatedAt)}</span>
                  {repo.fork ? <span>Fork</span> : null}
                  {repo.archived ? <span>Archived</span> : null}
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function LanguageChart({ languages }) {
  if (!languages.length) {
    return (
      <div className="gh-panel">
        <p className="kicker">
          <span className="kicker-index">02</span>
          Languages
        </p>
        <p className="gh-empty">No language byte counts were returned for owned repositories.</p>
      </div>
    );
  }

  return (
    <div className="gh-panel">
      <p className="kicker">
        <span className="kicker-index">02</span>
        Languages
      </p>
      <p className="gh-note">Byte counts from GitHub’s languages API, summed across owned repositories. Forks are excluded.</p>
      <ul className="gh-langs">
        {languages.map((lang) => (
          <li key={lang.name}>
            <div className="gh-lang-label">
              <span>{lang.name}</span>
              <span>{formatShare(lang.share)}</span>
            </div>
            <div className="gh-lang-track" aria-hidden="true">
              <span style={{ width: `${Math.max(lang.share * 100, 0.8)}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ActivityFeed({ activity }) {
  return (
    <div className="gh-panel gh-panel--wide">
      <p className="kicker">
        <span className="kicker-index">03</span>
        Public activity
      </p>
      <p className="gh-note">
        GitHub’s contribution heatmap is not available from the public REST API without an access token.
        This list is public events from the last 90 days — not a complete contribution history.
      </p>
      {activity.length === 0 ? (
        <p className="gh-empty">No public events were returned.</p>
      ) : (
        <ol className="gh-activity">
          {activity.map((item) => (
            <li key={item.id}>
              <a href={item.url} target="_blank" rel="noreferrer">
                <span>{item.label}</span>
                <time dateTime={item.at}>{formatDate(item.at)}</time>
              </a>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export function GithubDashboard() {
  const prefs = useMotionPrefs();
  const { status, data, error, stale, retry } = useGithubDashboard();

  return (
    <Section
      id="source"
      index="05"
      kicker="Source"
      title="Live GitHub record."
      aside="Public data from github.com/Evan0x. Counts and languages come from the API, not estimates."
    >
      {status === 'loading' && !data ? (
        <DashboardSkeleton />
      ) : status === 'error' ? (
        <div className="gh-status" role="alert">
          <p>{error}</p>
          <button type="button" className="gh-retry" onClick={retry}>
            Retry
          </button>
        </div>
      ) : (
        <div className="gh-board">
          {error ? (
            <p className="gh-banner" role="status">
              {error} Showing the last successful fetch.
            </p>
          ) : null}
          {stale && !error ? (
            <p className="gh-banner" role="status">
              Showing cached GitHub data while a refresh runs.
            </p>
          ) : null}
          <m.div {...revealProps(prefs)}>
            <ProfileCard profile={data.profile} />
          </m.div>
          <div className="gh-split">
            <m.div {...revealProps(prefs, 0.04)}>
              <RepoList repos={data.repos} />
            </m.div>
            <m.div {...revealProps(prefs, 0.08)}>
              <LanguageChart languages={data.languages} />
            </m.div>
          </div>
          <m.div {...revealProps(prefs, 0.06)}>
            <ActivityFeed activity={data.activity} />
          </m.div>
        </div>
      )}
    </Section>
  );
}
