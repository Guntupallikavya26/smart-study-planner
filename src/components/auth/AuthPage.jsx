import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import {
  GraduationCap,
  Sparkles,
  CalendarCheck,
  TrendingUp,
  RotateCcw,
  Flame,
} from 'lucide-react';

export default function AuthPage({ onLogin, onRegister }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [regSuccessMessage, setRegSuccessMessage] = useState('');

  const handleRegisterComplete = async (data) => {
    const result = await onRegister(data);
    if (result && result.success) {
      setRegSuccessMessage(result.message || 'Account created successfully in MySQL database! Please log in with your email and password.');
      setAuthMode('login');
    }
    return result;
  };

  return (
    <div className="auth-page-container">
      {/* Left Hero Brand Showcase (Desktop / Tablet) */}
      <div className="auth-hero-pane">
        <div className="hero-brand-top">
          <div className="brand-logo-container">
            <GraduationCap className="brand-icon" size={28} />
          </div>
          <div>
            <h1 className="brand-title">SmartStudy</h1>
            <span className="brand-subtitle">Planner & Progress Tracker</span>
          </div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} className="hero-badge-icon" />
            <span>Academic Performance Suite</span>
          </div>

          <h2 className="hero-heading">
            Master every syllabus topic & stay ahead of exam deadlines.
          </h2>

          <p className="hero-description">
            Organize daily study tasks, automate scientific spaced repetition (1-3-7-14 days),
            and achieve peak retention for all your university courses.
          </p>

          {/* Feature highlights */}
          <div className="hero-features-list">
            <div className="hero-feature-item">
              <div className="feature-icon-wrapper bg-indigo">
                <CalendarCheck size={18} />
              </div>
              <div>
                <strong>Smart Daily Time-Blocking</strong>
                <p>Plan daily focus intervals by course urgency and priority.</p>
              </div>
            </div>

            <div className="hero-feature-item">
              <div className="feature-icon-wrapper bg-emerald">
                <TrendingUp size={18} />
              </div>
              <div>
                <strong>Topic Mastery Analytics</strong>
                <p>Visualize completion rates and exam readiness in real time.</p>
              </div>
            </div>

            <div className="hero-feature-item">
              <div className="feature-icon-wrapper bg-purple">
                <RotateCcw size={18} />
              </div>
              <div>
                <strong>Spaced Repetition Schedule</strong>
                <p>Never forget crucial formulas or algorithms before finals.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live preview badge in hero footer */}
        <div className="hero-floating-card">
          <div className="floating-card-row">
            <div className="floating-user">
              <div className="floating-avatar">🎓</div>
              <div>
                <span className="floating-user-name">Alex Morgan</span>
                <span className="floating-user-sub">B.Tech CS • Sem 4</span>
              </div>
            </div>
            <div className="streak-badge">
              <Flame size={15} className="streak-flame" />
              <span>7 Day Streak</span>
            </div>
          </div>
          <div className="floating-progress-row">
            <span>Overall Progress</span>
            <strong>64% Mastered</strong>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: '64%' }} />
          </div>
        </div>
      </div>

      {/* Right Form Card */}
      <div className="auth-form-pane">
        <div className="auth-card-container">
          {/* Tab buttons to toggle Login / Register */}
          {authMode !== 'forgot' && (
            <div className="auth-tab-switch">
              <button
                type="button"
                className={`auth-tab-btn ${authMode === 'login' ? 'active' : ''}`}
                onClick={() => setAuthMode('login')}
              >
                Log In
              </button>
              <button
                type="button"
                className={`auth-tab-btn ${authMode === 'register' ? 'active' : ''}`}
                onClick={() => setAuthMode('register')}
              >
                Register
              </button>
            </div>
          )}

          {authMode === 'login' && (
            <LoginForm
              onLogin={onLogin}
              onSwitchToRegister={() => {
                setRegSuccessMessage('');
                setAuthMode('register');
              }}
              onSwitchToForgot={() => {
                setRegSuccessMessage('');
                setAuthMode('forgot');
              }}
              successMessage={regSuccessMessage}
            />
          )}

          {authMode === 'register' && (
            <RegisterForm
              onRegister={handleRegisterComplete}
              onSwitchToLogin={() => setAuthMode('login')}
            />
          )}

          {authMode === 'forgot' && (
            <ForgotPasswordForm
              onSwitchToLogin={() => setAuthMode('login')}
            />
          )}
        </div>
      </div>
    </div>
  );
}

