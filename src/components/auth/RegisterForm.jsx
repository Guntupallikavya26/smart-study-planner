import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterForm({ onRegister, onSwitchToLogin }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!email.trim()) {
      setError('Please enter a valid student email');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify and retype.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await onRegister({
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (!result.success) {
        setError(result.message || 'Registration failed. Email may already be in use.');
        setIsLoading(false);
      }
    } catch {
      setError('An error occurred during registration. Please try again.');
      setIsLoading(false);
    }
  };

  const isPasswordMatching = password && confirmPassword && password === confirmPassword;

  return (
    <div className="auth-form-wrapper">
      <div className="auth-form-header">
        <h2 className="auth-title">Create Student Account</h2>
        <p className="auth-subtitle">
          Join Smart Study Planner to manage your courses, daily tasks & revision intervals
        </p>
      </div>

      {error && (
        <div className="auth-alert auth-alert-error" role="alert">
          <AlertCircle size={18} className="auth-alert-icon" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        {/* Full Name */}
        <div className="form-group">
          <label htmlFor="reg-fullname">Full Name</label>
          <div className="input-with-icon">
            <User size={18} className="input-icon" />
            <input
              id="reg-fullname"
              type="text"
              placeholder="e.g. Alex Morgan"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="reg-email">Student Email</label>
          <div className="input-with-icon">
            <Mail size={18} className="input-icon" />
            <input
              id="reg-email"
              type="email"
              placeholder="e.g. student@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="reg-password">Password</label>
          <div className="input-with-icon">
            <Lock size={18} className="input-icon" />
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
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

        {/* Confirm Password */}
        <div className="form-group">
          <div className="label-with-action">
            <label htmlFor="reg-confirm-password">Confirm Password</label>
            {isPasswordMatching && (
              <span className="match-badge">
                <CheckCircle2 size={13} /> Passwords Match
              </span>
            )}
          </div>
          <div className="input-with-icon">
            <Lock size={18} className="input-icon" />
            <input
              id="reg-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Submit Register Button */}
        <button
          type="submit"
          className="btn btn-primary auth-submit-btn"
          disabled={isLoading}
        >
          <UserPlus size={18} />
          <span>{isLoading ? 'Creating Account...' : 'Register as Student'}</span>
        </button>
      </form>

      {/* Switch to Login Footer */}
      <div className="auth-footer-link">
        <span>Already have an account? </span>
        <button
          type="button"
          className="auth-link-btn"
          onClick={onSwitchToLogin}
        >
          Log in here
        </button>
      </div>
    </div>
  );
}

