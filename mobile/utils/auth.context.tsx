import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AuthService from '../utils/auth.service';
import { getUserRole, getUserid } from './auth.utils';
import Toast from 'react-native-toast-message';

type AuthContextType = {
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string, roleId: number) => Promise<any>;
  getRole: () => Promise<any>;
  getUserId: () => Promise<any>;
  authChanged: number;
  role: number;
  userId: number;
};

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authChanged, setAuthChanged] = useState(0);
  const [role, setrole] = useState(0);
  const [userId, setuserid] = useState(0);

  const login = async (email: string, password: string) => {
    const res = await AuthService.login(email, password);
    setAuthChanged((v) => v + 1);
    return res;
  };

  const register = async (name: string, email: string, password: string, roleId: number) => {
    const res = await AuthService.register(name, email, password, roleId);
    return res;
  };

  const getRole = async () => {
    const res = await getUserRole();
    setrole(res);
    return res;
  };

  const getUserId = async () => {
    const res = await getUserid();
    setuserid(res);
    return res;
  };

  return (
    <AuthContext.Provider value={{ login, register, authChanged, getRole, role, getUserId, userId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
