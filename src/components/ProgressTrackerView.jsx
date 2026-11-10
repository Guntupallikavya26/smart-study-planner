import React, { useState, useMemo } from 'react';
import {
  Award,
  Clock,
  Target,
  BookOpen,
  CheckCircle2,
  Circle,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Layers,
} from 'lucide-react';
import { apiToggleTopic } from '../utils/api';

export default function ProgressTrackerView({
  studentProfile,
  _metrics,
  subjects = [],
  onUpdateSubjects,
  showToast,
}) {
  const [topicSearch, setTopicSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Completed' | 'Pending'
  const [expandedSubjects, setExpandedSubjects] = useState({});

  // Toggle accordion expand/collapse for a subject's topics list
  const toggleSubjectExpanded = (subjectId) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [subjectId]: !prev[subjectId],
    }));
  };

  // Toggle all subjects expanded/collapsed
  const toggleAllExpanded = (expand) => {
    const next = {};
    subjects.forEach((s) => {
      next[s.id] = expand;
    });
    setExpandedSubjects(next);
  };

  // Handle direct topic toggle from within the Progress Tracker
  const handleToggleTopic = async (subjectId, topic) => {
    const isCurrentlyDone = topic.completed || topic.status === 'Completed';
    const nextCompleted = !isCurrentlyDone;
    const nextStatus = nextCompleted ? 'Completed' : 'Not Started';

    // Persist to Spring Boot MySQL backend
    if (typeof topic.id === 'number' || !isNaN(Number(topic.id))) {
      apiToggleTopic(topic.id).catch(() => {});
    }

    if (onUpdateSubjects) {
      onUpdateSubjects((prev) =>
        prev.map((sub) => {
          if (sub.id !== subjectId) return sub;
          const nextTopics = (sub.topics || []).map((t) =>
            t.id === topic.id
              ? { ...t, completed: nextCompleted, status: nextStatus }
              : t
          );
          const completedCount = nextTopics.filter(
            (t) => t.completed || t.status === 'Completed'
          ).length;
          const totalCount = nextTopics.length;
          const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

          return {
            ...sub,
            topics: nextTopics,
            completedTopics: completedCount,
            pendingTopics: Math.max(0, totalCount - completedCount),
            totalTopics: totalCount,
            progressPercentage: pct,
          };
        })
      );
    }

    if (showToast) {
      showToast(
        nextCompleted
          ? `Marked "${topic.title}" as Completed! 🎉`
          : `Marked "${topic.title}" as Pending`
      );
    }
  };

  // Compute live authoritative metrics across all enrolled subjects
  const dynamicStats = useMemo(() => {
    let totalTopics = 0;
    let completedTopics = 0;

    subjects.forEach((sub) => {
      const topics = sub.topics || [];
      if (topics.length > 0) {
        totalTopics += topics.length;
        completedTopics += topics.filter(
          (t) => t.completed || t.status === 'Completed'
        ).length;
      } else {
        totalTopics += sub.totalTopics || 0;
        completedTopics += sub.completedTopics || 0;
      }
    });

    const pendingTopics = Math.max(0, totalTopics - completedTopics);
    const overallProgress =
      totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    return {
      totalTopics,
      completedTopics,
      pendingTopics,
      overallProgress,
    };
  }, [subjects]);

  return (
    <div className="view-container">
      {/* Header */}
      <div className="view-header">
        <div>
          <h2 className="view-title">Progress Tracker</h2>
          <p className="view-subtitle">
            Comprehensive real-time syllabus analytics, topic completion status, and course mastery
          </p>
        </div>
        <div className="streak-pill-large">
          <Award size={18} className="award-icon" />
          <span>Academic Standing: {studentProfile?.targetGPA || 'Good Standing'}</span>
        </div>
      </div>

      {/* 4 Core Summary Metrics Cards (Requirements 1, 2, 3, 4) */}
      <div className="planner-summary-ribbon progress-summary-ribbon">
        <div className="ribbon-card">
          <div className="ribbon-icon-pill bg-indigo-subtle">
            <BookOpen size={18} className="text-indigo" />
          </div>
          <div>
            <span className="ribbon-label">Total Topics</span>
            <span className="ribbon-value">{dynamicStats.totalTopics} Topics</span>
          </div>
        </div>

        <div className="ribbon-card">
          <div className="ribbon-icon-pill bg-emerald-subtle">
            <CheckCircle2 size={18} className="text-emerald" />
          </div>
          <div>
            <span className="ribbon-label">Completed Topics</span>
            <span className="ribbon-value text-emerald">{dynamicStats.completedTopics} Completed</span>
          </div>
        </div>

        <div className="ribbon-card">
          <div className="ribbon-icon-pill bg-amber-subtle">
            <Clock size={18} className="text-amber" />
          </div>
          <div>
            <span className="ribbon-label">Pending Topics</span>
            <span className="ribbon-value text-amber">{dynamicStats.pendingTopics} Pending</span>
          </div>
        </div>

        <div className="ribbon-card">
          <div className="ribbon-icon-pill bg-purple-subtle">
            <Target size={18} className="text-purple" />
          </div>
          <div>
            <span className="ribbon-label">Overall Progress</span>
            <span className="ribbon-value text-indigo">{dynamicStats.overallProgress}%</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="progress-controls-bar">
        <div className="progress-search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search topics across all courses..."
            value={topicSearch}
            onChange={(e) => setTopicSearch(e.target.value)}
            className="progress-search-input"
          />
        </div>

        <div className="progress-filters-group">
          <div className="control-filters">
            <Filter size={15} className="filter-icon" />
            <span className="filter-label">Filter Topics:</span>
            {['All', 'Completed', 'Pending'].map((status) => (
              <button
                key={status}
                className={`filter-pill ${statusFilter === status ? 'active' : ''}`}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="accordion-toggle-btns">
            <button
              type="button"
              className="text-link-btn"
              onClick={() => toggleAllExpanded(true)}
            >
              Expand All
            </button>
            <span className="divider-dot">•</span>
            <button
              type="button"
              className="text-link-btn"
              onClick={() => toggleAllExpanded(false)}
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* Subject-Wise Topic Completion & Detailed Progress (Requirements 5, 6, 7, 8) */}
      <div className="progress-subjects-list">
        {subjects.length === 0 ? (
          <div className="empty-state-card">
            <Layers size={36} className="empty-icon" />
            <p>No registered subjects found. Add subjects in "My Subjects" to track your progress.</p>
          </div>
        ) : (
          subjects.map((sub) => {
            const rawTopics = sub.topics || [];
            const subTotal = rawTopics.length > 0 ? rawTopics.length : (sub.totalTopics || 0);
            const subCompleted = rawTopics.length > 0
              ? rawTopics.filter((t) => t.completed || t.status === 'Completed').length
              : (sub.completedTopics || 0);
            const subPending = Math.max(0, subTotal - subCompleted);
            const percent = subTotal > 0 ? Math.round((subCompleted / subTotal) * 100) : 0;

            // Filter topics for this subject based on search & filter
            const filteredTopics = rawTopics.filter((t) => {
              const isDone = t.completed || t.status === 'Completed';
              const matchesStatus =
                statusFilter === 'All'
                  ? true
                  : statusFilter === 'Completed'
                  ? isDone
                  : !isDone;
              const matchesSearch = topicSearch.trim()
                ? t.title.toLowerCase().includes(topicSearch.toLowerCase())
                : true;
              return matchesStatus && matchesSearch;
            });

            // Default to expanded unless user explicitly collapsed it
            const isExpanded = expandedSubjects[sub.id] !== false;

            return (
              <div key={sub.id} className="progress-subject-card">
                {/* Subject Header with Progress Bar */}
                <div
                  className="progress-subject-header"
                  onClick={() => toggleSubjectExpanded(sub.id)}
                  title="Click to toggle topics view"
                >
                  <div className="sub-header-left">
                    <span
                      className="sub-code-badge"
                      style={{
                        backgroundColor: sub.bgLight || '#eef2ff',
                        color: sub.color || '#4f46e5',
                        borderColor: sub.color || '#c7d2fe',
                      }}
                    >
                      {sub.code}
                    </span>
                    <div>
                      <div className="sub-title-row">
                        <h3 className="sub-heading-name">{sub.name}</h3>
                        {sub.difficulty && (
                          <span className={`diff-pill diff-${sub.difficulty.toLowerCase()}`}>
                            {sub.difficulty}
                          </span>
                        )}
                      </div>
                      <span className="sub-instructor-text">
                        {sub.instructor ? `Instructor: ${sub.instructor}` : 'Academic Course'}
                        {sub.currentUnit ? ` • Current Unit: ${sub.currentUnit}` : ''}
                      </span>
                    </div>
                  </div>

                  <div className="sub-header-right">
                    {/* Subject-Wise Topic Summary */}
                    <div className="sub-topic-counts-group">
                      <span className="sub-stat-pill">
                        Total: <strong>{subTotal}</strong>
                      </span>
                      <span className="sub-stat-pill pill-completed">
                        Completed: <strong>{subCompleted}</strong>
                      </span>
                      <span className="sub-stat-pill pill-pending">
                        Pending: <strong>{subPending}</strong>
                      </span>
                      <span className="sub-percent-number" style={{ color: sub.color || '#4f46e5' }}>
                        {percent}%
                      </span>
                    </div>

                    <button
                      type="button"
                      className="sub-expand-btn"
                      aria-label={isExpanded ? 'Collapse topics' : 'Expand topics'}
                    >
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {/* Progress Bar (Requirement 6) */}
                <div className="subject-progress-track">
                  <div
                    className="subject-progress-fill"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: sub.color || '#6366f1',
                    }}
                  />
                </div>

                {/* Topic Breakdown List (Requirements 7 & 8) */}
                {isExpanded && (
                  <div className="sub-topics-breakdown">
                    <div className="topics-breakdown-header">
                      <span className="breakdown-title">
                        Syllabus Topics ({filteredTopics.length} of {subTotal})
                      </span>
                      <span className="breakdown-hint">
                        💡 Click checkbox to toggle completion status in MySQL
                      </span>
                    </div>

                    {filteredTopics.length === 0 ? (
                      <div className="empty-topics-notice">
                        {rawTopics.length === 0
                          ? 'No chapters added to this course syllabus yet. Add topics under "My Subjects".'
                          : 'No topics match the selected search or filter.'}
                      </div>
                    ) : (
                      <div className="topics-items-grid">
                        {filteredTopics.map((topic, idx) => {
                          const isDone = topic.completed || topic.status === 'Completed';

                          return (
                            <div
                              key={topic.id || idx}
                              className={`progress-topic-item ${isDone ? 'topic-item-completed' : 'topic-item-pending'}`}
                            >
                              <div className="topic-item-left">
                                <button
                                  type="button"
                                  className="topic-check-btn"
                                  onClick={() => handleToggleTopic(sub.id, topic)}
                                  title={isDone ? 'Mark as Pending' : 'Mark as Completed'}
                                  aria-label={isDone ? 'Mark as Pending' : 'Mark as Completed'}
                                >
                                  {isDone ? (
                                    <CheckCircle2 size={19} className="check-icon-done text-emerald" />
                                  ) : (
                                    <Circle size={19} className="check-icon-pending text-muted" />
                                  )}
                                </button>
                                <span className={`topic-title-label ${isDone ? 'text-done' : ''}`}>
                                  {topic.title}
                                </span>
                              </div>

                              <div className="topic-item-right">
                                {topic.difficulty && (
                                  <span className={`diff-tag diff-${topic.difficulty.toLowerCase()}`}>
                                    {topic.difficulty}
                                  </span>
                                )}

                                {/* Clearly identify Completed or Pending (Requirement 8) */}
                                <span
                                  className={`topic-status-badge ${
                                    isDone ? 'status-badge-completed' : 'status-badge-pending'
                                  }`}
                                  onClick={() => handleToggleTopic(sub.id, topic)}
                                  title="Click to toggle"
                                >
                                  {isDone ? (
                                    <>
                                      <CheckCircle2 size={13} />
                                      <span>Completed</span>
                                    </>
                                  ) : (
                                    <>
                                      <Clock size={13} />
                                      <span>Pending</span>
                                    </>
                                  )}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
