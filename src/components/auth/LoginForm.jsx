import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function LoginForm({ onLogin, onSwitchToRegister, onSwitchToForgot, successMessage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your student email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);

    try {
      const res = await onLogin(email.trim(), password, rememberMe);
      if (!res || !res.success) {
        setError(res?.message || 'Invalid email or password. Please verify your credentials.');
        setIsLoading(false);
      }
    } catch {
      setError('An unexpected error occurred during login. Please try again.');
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('alex.morgan@university.edu');
    setPassword('password123');
    setError('');
    setIsLoading(true);
    try {
      await onLogin('alex.morgan@university.edu', 'password123', true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-wrapper">
      <div className="auth-form-header">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">
          Log in to continue your personalized study plan & track exam prep
        </p>
      </div>

      {successMessage && (
        <div className="auth-alert auth-alert-success" role="status">
          <CheckCircle2 size={18} className="auth-alert-icon" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="auth-alert auth-alert-error" role="alert">
          <AlertCircle size={18} className="auth-alert-icon" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="login-email">Student Email</label>
          <div className="input-with-icon">
            <Mail size={18} className="input-icon" />
            <input
              id="login-email"
              type="email"
              placeholder="e.g. alex.morgan@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="form-group">
          <div className="label-with-action">
            <label htmlFor="login-password">Password</label>
            <button
              type="button"
              className="forgot-password-link"
              onClick={onSwitchToForgot}
            >
              Forgot Password?
            </button>
          </div>
          <div className="input-with-icon">
            <Lock size={18} className="input-icon" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <div className="auth-remember-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Remember my session</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary auth-submit-btn"
          disabled={isLoading}
        >
          <span>{isLoading ? 'Verifying...' : 'Log In to Dashboard'}</span>
          <ArrowRight size={18} />
        </button>

        {/* Quick Demo Login Pill */}
        <div className="auth-divider">
          <span>OR QUICK ACCESS</span>
        </div>

        <button
          type="button"
          className="btn-demo-account"
          onClick={handleDemoLogin}
          title="Instant log in with pre-filled demo student account"
        >
          <Sparkles size={16} className="demo-sparkle-icon" />
          <div className="demo-account-text">
            <strong>Quick Demo Login: Alex Morgan</strong>
            <small>alex.morgan@university.edu • password123</small>
          </div>
        </button>
      </form>

      {/* Switch to Register Footer */}
      <div className="auth-footer-link">
        <span>Don't have an account? </span>
        <button
          type="button"
          className="auth-link-btn"
          onClick={onSwitchToRegister}
        >
          Create Student Account
        </button>
      </div>
    </div>
  );
}

