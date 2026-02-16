import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../components/public/PublicLayout';
import { API_URL } from '../../config/api';
import '../../components/auth/Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/auth/forgot-password?email=${encodeURIComponent(email)}`,
        { method: 'POST' }
      );

      const text = await response.text();
      setMessage(text || 'If email exists, reset link sent');
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('Request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Forgot Password</h1>
            <p>Enter your email to receive a reset link</p>
          </div>

          {error && (
            <div className="auth-error">
              <span>⚠️ {error}</span>
            </div>
          )}

          {message && (
            <div
              style={{
                padding: '12px 14px',
                background: '#ecfdf5',
                border: '1px solid #d1fae5',
                borderRadius: 10,
                color: '#065f46',
                marginBottom: 12,
                fontSize: 14,
              }}
            >
              {message}
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

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Back to <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ForgotPassword;
