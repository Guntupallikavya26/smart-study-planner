import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  TrendingUp,
  RotateCcw,
  GraduationCap,
  Sparkles,
  X,
  LogOut,
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen, studentProfile, onLogout }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'subjects', label: 'My Subjects', icon: BookOpen, badge: '5' },
    { id: 'planner', label: 'Study Planner', icon: CalendarCheck, badge: '3 today' },
    { id: 'progress', label: 'Progress Tracker', icon: TrendingUp, badge: '64%' },
    { id: 'revision', label: 'Revision Schedule', icon: RotateCcw, badge: '2 due' },
  ];

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Brand header */}
        <div className="sidebar-brand">
          <div className="brand-logo-container">
            <GraduationCap className="brand-icon" size={26} />
          </div>
          <div className="brand-info">
            <h1 className="brand-title">SmartStudy</h1>
            <span className="brand-subtitle">Planner & Tracker</span>
          </div>
          <button
            className="sidebar-close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="sidebar-nav">
          <div className="nav-group-label">MAIN MENU</div>
          <ul className="nav-list">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsOpen(false);
                    }}
                  >
                    <Icon className="nav-item-icon" size={20} />
                    <span className="nav-item-label">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`nav-item-badge ${
                          item.badge.includes('due')
                            ? 'badge-due'
                            : item.badge.includes('%')
                            ? 'badge-progress'
                            : ''
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Study Tip Card */}
        <div className="sidebar-tip-card">
          <div className="tip-header">
            <Sparkles size={16} className="tip-icon" />
            <span className="tip-label">Study Tip of the Day</span>
          </div>
          <p className="tip-text">
            Use 25-minute Pomodoro sprints followed by 5-minute active recall breaks.
          </p>
        </div>

        {/* User profile footer */}
        <div className="sidebar-user">
          <img
            src={studentProfile.avatar}
            alt={studentProfile.name}
            className="user-avatar"
          />
          <div className="user-details">
            <span className="user-name">{studentProfile.name}</span>
            <span className="user-role">{studentProfile.semester}</span>
          </div>
          <button
            className="logout-btn"
            onClick={onLogout}
            title="Logout"
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>
    </>
  );
}

