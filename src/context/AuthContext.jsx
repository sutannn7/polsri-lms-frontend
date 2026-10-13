import { createContext, useCallback, useMemo, useState } from 'react';
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