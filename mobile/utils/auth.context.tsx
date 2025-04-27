import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AuthService from '../utils/auth.service';
import { getUserRole } from './auth.utils';

type AuthContextType = {
  login: (email: string, password: string) => Promise<any>;
  getRole: () => Promise<any>;
  authChanged: number;
  role: number;
};

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authChanged, setAuthChanged] = useState(0);
  const [role, setrole] = useState(0);

  const login = async (email: string, password: string) => {
    const res = await AuthService.login(email, password);
    setAuthChanged((v) => v + 1);
    return res;
  };

  const getRole = async () => {
    const res = await getUserRole();
    setrole(res);
    return res;
  };

  return (
    <AuthContext.Provider value={{ login, authChanged, getRole, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
