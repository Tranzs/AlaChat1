import { createContext, useContext, useState, useEffect } from 'react';
import { getApiBaseUrl } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('alachat_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('alachat_user');
      }
    }
    setLoading(false);
  }, []);

  // Login with username/password
  const login = async (username, password) => {
    try {
      const API_URL = getApiBaseUrl();
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const result = await response.json();
      
      if (result.success) {
        const userData = result.data;
        setUser(userData);
        localStorage.setItem('alachat_user', JSON.stringify(userData));
        return { success: true, user: userData };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: { message: 'Network error' } };
    }
  };

  // Register new user
  const register = async (username, password, name, avatar = null) => {
    try {
      const API_URL = getApiBaseUrl();
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, name, avatar })
      });
      
      const result = await response.json();
      
      if (result.success) {
        const userData = result.data;
        setUser(userData);
        localStorage.setItem('alachat_user', JSON.stringify(userData));
        return { success: true, user: userData };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: { message: 'Network error' } };
    }
  };

  // Legacy login (create user by name only) - for backward compatibility
  const loginByName = async (name, avatar = null) => {
    try {
      const API_URL = getApiBaseUrl();
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, avatar })
      });
      
      const result = await response.json();
      
      if (result.success) {
        const userData = result.data;
        setUser(userData);
        localStorage.setItem('alachat_user', JSON.stringify(userData));
        return { success: true, user: userData };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: { message: 'Network error' } };
    }
  };

  // Update user profile
  const updateUser = async (updates) => {
    if (!user) return { success: false, error: { message: 'Not logged in' } };

    try {
      const API_URL = getApiBaseUrl();
      const response = await fetch(`${API_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      const result = await response.json();
      
      if (result.success) {
        const updatedUser = result.data;
        setUser(updatedUser);
        localStorage.setItem('alachat_user', JSON.stringify(updatedUser));
        return { success: true, user: updatedUser };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Update error:', error);
      return { success: false, error: { message: 'Network error' } };
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('alachat_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginByName, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
