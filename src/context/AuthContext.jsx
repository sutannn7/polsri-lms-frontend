import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import {
  getCurrentUser,
  login as authenticate,
  logout as endSession,
} from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getCurrentUser);

  const login = useCallback(async (id, password) => {
    const authenticatedUser = await authenticate(id, password);
    setUser(authenticatedUser);
    return authenticatedUser;
  }, []);

  const logout = useCallback(() => {
    endSession();
    setUser(null);
  }, []);

  const refreshUser = useCallback(() => {
    setUser(getCurrentUser());
  }, []);

  // Back / Forward can bring the page back from the browser cache with the
  // state it had when it left, so the session marker is read again here: a
  // signed-in visitor lands back inside the app, a signed-out one does not.
  useEffect(() => {
    function handlePageShow() {
      refreshUser();
    }

    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [refreshUser]);

  const contextValue = useMemo(
    () => ({
      user,
      login,
      logout,
      refreshUser,
      isAuthenticated: Boolean(user),
    }),
    [user, login, logout, refreshUser],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}