import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../utils/api.js';

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/sessions/active')
      .then((d) => setSession(d.session))
      .catch(() => setSession(null))
      .finally(() => setLoading(false));
  }, []);

  const startSession = useCallback(async (name) => {
    const d = await api('/sessions', { method: 'POST', body: { name } });
    setSession(d.session);
  }, []);

  const endSession = useCallback(async () => {
    if (!session) return;
    await api(`/sessions/${session.id}/end`, { method: 'POST' });
    setSession(null);
  }, [session]);

  return (
    <SessionContext.Provider value={{ session, loading, startSession, endSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside SessionProvider');
  return ctx;
}