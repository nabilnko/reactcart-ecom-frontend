import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PublicLayout from '../../components/public/PublicLayout';
import { API_URL } from '../../config/api';
import '../../components/auth/Auth.css';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const token = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('token') || '';
  }, [location.search]);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');

    if (!token) {
      setError('Missing token. Please use the link from your email.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const body = new URLSearchParams({
        token,
        newPassword,
      });

      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body,
      });

      const text = await response.text();

      if (!response.ok) {
        throw new Error(text || 'Reset failed');
      }

      setMessage(text || 'Password reset successful');
      setTimeout(() => navigate('/login'), 800);
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err?.message || 'Reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Reset Password</h1>
            <p>Choose a new password for your account</p>
          </div>

          {!token && (
            <div className="auth-error">
              <span>⚠️ Missing token. Open the reset link from your email.</span>
            </div>
          )}

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
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                disabled={loading || !token}
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                disabled={loading || !token}
              />
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={loading || !token}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword;
