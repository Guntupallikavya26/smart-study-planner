import React, { useState } from 'react';
import { Sparkles, Play, PlusCircle, CheckCircle } from 'lucide-react';

export default function WelcomeBanner({ studentProfile, onQuickAction, todayCompletedCount, todayTotalCount }) {
  const [timeGreeting] = useState(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 12 && currentHour < 17) {
      return 'Good afternoon';
    } else if (currentHour >= 17) {
      return 'Good evening';
    }
    return 'Good morning';
  });

  const progressPercent = todayTotalCount > 0 ? Math.round((todayCompletedCount / todayTotalCount) * 100) : 0;

  return (
    <section className="welcome-banner">
      <div className="welcome-content">
        <div className="welcome-pill">
          <Sparkles size={14} className="pill-icon" />
          <span>Semester 4 • Academic Focus Active</span>
        </div>

        <h2 className="welcome-title">
          {timeGreeting}, <span className="highlight-name">{studentProfile.name.split(' ')[0]}!</span> 🎓
        </h2>

        <p className="welcome-description">
          You're doing great! You have completed <strong>{todayCompletedCount} of {todayTotalCount}</strong> study
          tasks planned for today ({progressPercent}% finished). Stay consistent for your upcoming finals!
        </p>

        <div className="welcome-actions">
          <button
            className="btn btn-primary"
            onClick={() => onQuickAction('start-session')}
          >
            <Play size={16} fill="currentColor" />
            <span>Start Study Session</span>
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => onQuickAction('add-task')}
          >
            <PlusCircle size={16} />
            <span>Add Study Task</span>
          </button>
        </div>
      </div>

      <div className="welcome-stats-widget">
        <div className="goal-ring-card">
          <div className="goal-label">Today's Daily Target</div>
          <div className="goal-value-row">
            <span className="goal-value">{studentProfile.completedHoursThisWeek} hrs</span>
            <span className="goal-target">/ {studentProfile.weeklyGoalHours} hrs this week</span>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{
                width: `${Math.min(100, Math.round((studentProfile.completedHoursThisWeek / studentProfile.weeklyGoalHours) * 100))}%`,
              }}
            />
          </div>
          <div className="goal-subtext">
            <CheckCircle size={14} className="goal-check-icon" />
            <span>74% of weekly target reached</span>
          </div>
        </div>
      </div>
    </section>
  );
}
