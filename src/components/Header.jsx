import React, { useState } from 'react';
import { Menu, Search, Flame, Bell, Calendar as CalendarIcon, LogOut } from 'lucide-react';

export default function Header({ onMenuClick, studentProfile, searchQuery, setSearchQuery, onLogout }) {
  const [todayFormatted] = useState(() => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date());
  });

  return (
    <header className="top-header">
      <div className="header-left">
        <button
          className="menu-toggle-btn"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>

        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search subjects, topics, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="header-right">
        {/* Date display */}
        <div className="header-date">
          <CalendarIcon size={16} className="date-icon" />
          <span>{todayFormatted}</span>
        </div>

        {/* Streak Badge */}
        <div className="streak-badge" title="Consecutive study streak">
          <Flame size={18} className="streak-flame" />
          <span className="streak-count">{studentProfile.streakDays} Day Streak</span>
        </div>

        {/* Notifications */}
        <button className="icon-action-btn" aria-label="Notifications" title="Notifications">
          <Bell size={20} />
          <span className="notification-dot" />
        </button>

        {/* Logout Button */}
        <button
          className="icon-action-btn logout-btn-header"
          onClick={onLogout}
          aria-label="Logout"
          title="Logout"
        >
          <LogOut size={20} />
        </button>

        {/* User Mini Profile */}
        <div className="header-user-badge">
          <img
            src={studentProfile.avatar}
            alt={studentProfile.name}
            className="header-avatar"
          />
          <div className="header-user-text">
            <span className="header-user-name">{studentProfile.name.split(' ')[0]}</span>
            <span className="header-user-sub">Student</span>
          </div>
        </div>
      </div>
    </header>
  );
}
