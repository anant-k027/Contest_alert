import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          const { data } = await api.get('/auth/me');
          setUser(data);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);
        localStorage.removeItem('accessToken');
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', data.token);
    setUser(data);
    return data;
  };

  const register = async (email, password) => {
    const { data } = await api.post('/auth/register', { email, password });
    localStorage.setItem('accessToken', data.token);
    setUser(data);
    return data;
  };

  const updatePreferences = async (preferencesData) => {
    try {
      const response = await api.put('/users/preferences', preferencesData);
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating preferences', error);
      throw error;
    }
  };

  const updateHandles = async (handlesData) => {
    try {
      const response = await api.put('/users/handles', handlesData);
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating handles', error);
      throw error;
    }
  };

  const syncStats = async () => {
    try {
      const response = await api.post('/users/sync-stats');
      // Sync stats returns { message, platformStats } but we need to update user.platformStats
      setUser(prev => ({
        ...prev,
        platformStats: response.data.platformStats
      }));
      return response.data;
    } catch (error) {
      console.error('Error syncing stats', error);
      throw error;
    }
  };

  const logout = async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updatePreferences, updateHandles, syncStats }}>
      {children}
    </AuthContext.Provider>
  );
};
