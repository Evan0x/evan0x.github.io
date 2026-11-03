import { useCallback, useEffect, useState } from 'react';
import {
  cacheIsFresh,
  loadGithubDashboard,
  readGithubCache,
  writeGithubCache,
} from './api.js';

export function useGithubDashboard() {
  const [status, setStatus] = useState('loading');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [stale, setStale] = useState(false);

  const load = useCallback(async ({ force = false } = {}) => {
    const cached = readGithubCache();
    if (!force && cacheIsFresh(cached)) {
      setData(cached.data);
      setError('');
      setStale(false);
      setStatus('ready');
      return;
    }

    if (!force && cached?.data) {
      setData(cached.data);
      setStale(true);
      setStatus('ready');
    } else {
      setStatus('loading');
    }

    try {
      const next = await loadGithubDashboard();
      writeGithubCache(next);
      setData(next);
      setError('');
      setStale(false);
      setStatus('ready');
    } catch (err) {
      if (cached?.data) {
        setData(cached.data);
        setStale(true);
        setError(err instanceof Error ? err.message : 'GitHub data could not be refreshed.');
        setStatus('ready');
        return;
      }
      setError(err instanceof Error ? err.message : 'GitHub data could not be loaded.');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    status,
    data,
    error,
    stale,
    retry: () => load({ force: true }),
  };
}
