import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/services/api';
import type { User, LoginRequest, RegisterRequest } from '@/types/api.types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Verificar token al cargar la aplicación
  const verifyToken = useCallback(async () => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiService.verifyToken();

      if (response.success && response.data?.valid && response.data.user) {
        setUser(response.data.user);
        localStorage.setItem('auth_user', JSON.stringify(response.data.user));
      } else {
        // Token inválido
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setUser(null);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await apiService.login(credentials);

      if (response.success && response.data) {
        const { user, token } = response.data;

        // Guardar token y usuario
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));
        setUser(user);

        // Navegar al dashboard
        navigate('/dashboard');
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Login failed';
      throw new Error(errorMessage);
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response = await apiService.register(data);

      if (response.success && response.data) {
        const { user, token } = response.data;

        // Guardar token y usuario
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));
        setUser(user);

        // Navegar al dashboard
        navigate('/dashboard');
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Register error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Registration failed';
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Limpiar estado y storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      setUser(null);
      navigate('/login');
    }
  };

  const refreshUser = async () => {
    try {
      const response = await apiService.getCurrentUser();

      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem('auth_user', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
