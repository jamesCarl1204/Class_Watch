// src/hooks/useLiveSession.js
import { useEffect, useState } from 'react';
import { api } from '../utils/api.js';

const EMPTY = {
  stats: { active: 0, tabSwitches: 0, aiPastes: 0, avgFocus: null },
  students: [],
  events: [],
};

export default function useLiveSession(sessionId, intervalMs = 3000) {
  const [data, setData] = useState(EMPTY);

  useEffect(() => {
    if (!sessionId) {
      setData(EMPTY);
      return;
    }
    let cancelled = false;

    const load = async () => {
      try {
        const d = await api(`/sessions/${sessionId}/live`);
        if (!cancelled) setData(d);
      } catch {
        /* ignore, retry sa next tick */
      }
    };

    load();
    const t = setInterval(load, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [sessionId, intervalMs]);

  return data;
}