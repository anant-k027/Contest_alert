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
    setUser({ _id: data._id, email: data.email });
    return data;
  };

  const register = async (email, password) => {
    const { data } = await api.post('/auth/register', { email, password });
    localStorage.setItem('accessToken', data.token);
    setUser({ _id: data._id, email: data.email });
    return data;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
