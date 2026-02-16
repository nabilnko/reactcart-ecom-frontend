import React, { createContext, useState, useContext, useEffect } from 'react';
import { API_URL } from '../config/api';


const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);


  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', { email, password: '***' });
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        
        // Store token and user info
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('user', JSON.stringify({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role
        }));
        
        // Update state
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role
        });
        
        return true;
      } else {
        const error = await response.text();
        console.error('Login failed:', error);
        alert(error || 'Invalid email or password');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your connection and try again.');
      return false;
    }
  };


  


  const register = async (name, email, password, role = 'customer') => {
    try {
      console.log('Attempting registration with:', { 
        name, 
        email, 
        password: '***', 
        role 
      });
      
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name,      // Ensure correct field order
          email, 
          password, 
          role 
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Registration successful:', data);
        
        // Store token and user info
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('user', JSON.stringify({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role
        }));
        
        // Update state
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role
        });
        
        return true;
      } else {
        const error = await response.text();
        console.error('Registration failed:', error);
        alert(error || 'Registration failed. Email might already be in use.');
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please check your connection and try again.');
      return false;
    }
  };


  const logout = () => {
    // Clear all user-related data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('cart_guest');
    
    // Clear user-specific cart if exists
    if (user) {
      localStorage.removeItem(`cart_${user.id}`);
    }
    
    setUser(null);
  };

  // ✅ NEW: Update user function
  const updateUser = (updatedUserData) => {
    const updatedUser = {
      id: updatedUserData.id,
      name: updatedUserData.name,
      email: updatedUserData.email,
      role: updatedUserData.role
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };


  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      loading,
      updateUser  // ✅ ADDED
    }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
