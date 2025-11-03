import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Login attempt with:', { email, password: '***' });
    
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      
      console.log('Login result:', success);
      
      if (success) {
        console.log('Login successful! Redirecting...');
        setTimeout(() => {
          const currentUser = JSON.parse(localStorage.getItem('user'));
          if (currentUser?.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/');
          }
        }, 100);
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <img 
            src="/logo.png" 
            alt="KiaRa Lifestyle" 
            style={{ 
              height: '120px',
              width: 'auto',
              objectFit: 'contain',
              marginBottom: '16px'
            }} 
          />
          <h1>KiaRa Lifestyle</h1>
          <p>Sign in to your account</p>
        </div>

        {error && (
          <div className="auth-error">
            <span>⚠️ {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>

        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: '#f3f4f6',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#6b7280'
        }}>
          <strong>Demo Accounts:</strong><br/>
          <strong>Admin:</strong> admin@shop.com<br/>
          <strong>Customer:</strong> any other email
        </div>
      </div>
    </div>
  );
};

export default Login;
