import React, { useState } from 'react';
import { Mail, ArrowLeft, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ForgotPasswordForm({ onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your registered student email');
      return;
    }

    setIsSubmitted(true);
  };

  return (
    <div className="auth-form-wrapper">
      <div className="auth-form-header">
        <button
          type="button"
          className="back-to-login-btn"
          onClick={onSwitchToLogin}
        >
          <ArrowLeft size={16} />
          <span>Back to login</span>
        </button>

        <h2 className="auth-title">Reset Your Password</h2>
        <p className="auth-subtitle">
          Enter your student email and we'll provide instructions to regain access
        </p>
      </div>

      {isSubmitted ? (
        <div className="auth-success-card">
          <div className="success-icon-box">
            <CheckCircle2 size={32} />
          </div>
          <h3>Password Reset Link Sent</h3>
          <p>
            We have sent password recovery instructions to <strong>{email}</strong>.
            Please check your student email inbox.
          </p>
          <div className="demo-reset-hint">
            <KeyRound size={16} />
            <span>
              For demo testing, you can log in directly with: <code>alex.morgan@university.edu</code> / <code>password123</code>
            </span>
          </div>
          <button
            type="button"
            className="btn btn-primary auth-submit-btn"
            onClick={onSwitchToLogin}
          >
            <span>Return to Login Screen</span>
          </button>
        </div>
      ) : (
        <>
          {error && (
            <div className="auth-alert auth-alert-error" role="alert">
              <AlertCircle size={18} className="auth-alert-icon" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="reset-email">Registered Student Email</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  id="reset-email"
                  type="email"
                  placeholder="e.g. alex.morgan@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary auth-submit-btn">
              <span>Send Recovery Instructions</span>
            </button>
          </form>

          <div className="auth-footer-link">
            <span>Remembered your password? </span>
            <button
              type="button"
              className="auth-link-btn"
              onClick={onSwitchToLogin}
            >
              Sign in now
            </button>
          </div>
        </>
      )}
    </div>
  );
}

