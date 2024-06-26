import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const storeData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {

    console.error('Error storing data', e);
  }
};

const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return JSON.parse(value);
  } catch (e) {
    console.error('Error retrieving data', e);
    return null;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await getData('pred-token');
      if (storedToken) {
        setToken(storedToken);
      }
    };

    fetchToken();
  }, []);

  const login = (token: string) => {
    setToken(token);
    storeData('pred-token', token);
  };

  const logout = () => {
    setToken(null);
    AsyncStorage.removeItem('pred-token');
    router.replace('/');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
