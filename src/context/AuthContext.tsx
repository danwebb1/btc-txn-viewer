import React from 'react'
import { createContext, useContext, useEffect, useState } from 'react';
import {auth} from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export interface User {
  uid: string|null;
  displayName: string|null;
  email: string|null;
  photoURL: string|null;
}
export interface AuthContextType {
  user: User|null;
  loading: boolean;
}
interface AuthContextProviderProps {
  children?: React.ReactNode
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<User|null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, displayName, email, photoURL} = user
        setUser({ uid, displayName, email, photoURL});
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
      // @ts-ignore
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};