import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../utils/api.js';

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);   
  const [loading, setLoading] = useState(true);

  

  const startSession = useCallback(async (name) => {
  }, []);

  const endSession = useCallback(async () => {
  }, [session]);

  return (
    <SessionContext.Provider value={{ session, loading, startSession, endSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {  }