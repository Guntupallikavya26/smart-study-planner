import React, { useState, useMemo } from 'react';
import {
  Calendar,
  User,
  CheckCircle,
  Clock,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  Layers,
  X,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import {
  apiCreateSubject,
  apiUpdateSubject,
  apiDeleteSubject,
  apiCreateTopic,
  apiUpdateTopic,
  apiToggleTopic,
  apiDeleteTopic,
} from '../utils/api';

const PRESET_COLORS = [
  { color: '#6366f1', bgLight: '#eef2ff', name: 'Indigo' },
  { color: '#0ea5e9', bgLight: '#f0f9ff', name: 'Sky' },
  { color: '#10b981', bgLight: '#ecfdf5', name: 'Emerald' },
  { color: '#f59e0b', bgLight: '#fffbeb', name: 'Amber' },
  { color: '#8b5cf6', bgLight: '#f5f3ff', name: 'Purple' },
  { color: '#ec4899', bgLight: '#fdf2f8', name: 'Rose' },
];

export default function SubjectsView({
  subjects = [],
  currentUser,
  onUpdateSubjects,
  showToast,
}) {
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [subjectSearch, setSubjectSearch] = useState('');
  const [expandedSubjectId, setExpandedSubjectId] = useState(null);

  // Subject Modals
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [deletingSubject, setDeletingSubject] = useState(null);

  // Subject Form State
  const [subjectForm, setSubjectForm] = useState({
    code: '',
    name: '',
    instructor: '',
    difficulty: 'Medium',
    currentUnit: '',
    examDate: '',
    color: '#6366f1',
    bgLight: '#eef2ff',
  });

  // Topic Modals & State
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [targetSubjectForTopic, setTargetSubjectForTopic] = useState(null);
  const [editingTopic, setEditingTopic] = useState(null);
  const [deletingTopic, setDeletingTopic] = useState(null);

  // Topic Form State
  const [topicForm, setTopicForm] = useState({
    title: '',
    difficulty: 'Medium',
    status: 'Not Started',
  });

  // Topic Filter within Expanded Subject
  const [topicFilterStatus, setTopicFilterStatus] = useState('All');

  // Filter subjects based on search and difficulty
  const filteredSubjects = useMemo(() => {
    return subjects.filter((s) => {
      const matchesDiff =
        filterDifficulty === 'All' || s.difficulty === filterDifficulty;
      const matchesSearch =
        s.name.toLowerCase().includes(subjectSearch.toLowerCase()) ||
        s.code.toLowerCase().includes(subjectSearch.toLowerCase()) ||
        (s.currentUnit &&
          s.currentUnit.toLowerCase().includes(subjectSearch.toLowerCase()));
      return matchesDiff && matchesSearch;
    });
  }, [subjects, filterDifficulty, subjectSearch]);

  // Overall Statistics across all subjects
  const overallStats = useMemo(() => {
    let totalSubs = subjects.length;
    let totalTopics = 0;
    let completedTopics = 0;

    subjects.forEach((s) => {
      const topics = s.topics || [];
      totalTopics += topics.length;
      completedTopics += topics.filter(
        (t) => t.completed || t.status === 'Completed'
      ).length;
    });

    const completionRate =
      totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    return { totalSubs, totalTopics, completedTopics, completionRate };
  }, [subjects]);

  // ---------------------------------------------------------------------------
  // Subject CRUD Handlers
  // ---------------------------------------------------------------------------

  const openAddSubjectModal = () => {
    setEditingSubject(null);
    setSubjectForm({
      code: '',
      name: '',
      instructor: '',
      difficulty: 'Medium',
      currentUnit: '',
      examDate: '',
      color: '#6366f1',
      bgLight: '#eef2ff',
    });
    setShowSubjectModal(true);
  };

  const openEditSubjectModal = (sub) => {
    setEditingSubject(sub);
    setSubjectForm({
      code: sub.code,
      name: sub.name,
      instructor: sub.instructor || '',
      difficulty: sub.difficulty || 'Medium',
      currentUnit: sub.currentUnit || '',
      examDate: sub.examDate || '',
      color: sub.color || '#6366f1',
      bgLight: sub.bgLight || '#eef2ff',
    });
    setShowSubjectModal(true);
  };

  const handleSaveSubject = async (e) => {
    e.preventDefault();
    if (!subjectForm.name.trim() || !subjectForm.code.trim()) {
      if (showToast) showToast('Subject code and name are required.');
      return;
    }

    const studentId = currentUser?.id || 1;

    if (editingSubject) {
      // UPDATE Subject
      const updatedData = {
        ...editingSubject,
        ...subjectForm,
        studentId,
      };

      // Call Spring Boot API
      await apiUpdateSubject(editingSubject.id, updatedData);

      onUpdateSubjects((prev) =>
        prev.map((s) => (s.id === editingSubject.id ? { ...s, ...updatedData } : s))
      );
      if (showToast) showToast(`Subject "${subjectForm.code}" updated.`);
    } else {
      // CREATE Subject
      const newSubjectPayload = {
        ...subjectForm,
        studentId,
        topics: [],
        completedTopics: 0,
        pendingTopics: 0,
        totalTopics: 0,
      };

      // Call Spring Boot API (falls back gracefully)
      const apiResult = await apiCreateSubject(newSubjectPayload);
      const createdSubject = {
        ...newSubjectPayload,
        id: apiResult?.id || `sub-${Date.now()}`,
        topics: [],
      };

      onUpdateSubjects((prev) => [createdSubject, ...prev]);
      if (showToast) showToast(`Subject "${subjectForm.code}" added successfully.`);
    }

    setShowSubjectModal(false);
  };

  const handleDeleteSubject = async () => {
    if (!deletingSubject) return;

    // Call Spring Boot API
    await apiDeleteSubject(deletingSubject.id);

    onUpdateSubjects((prev) => prev.filter((s) => s.id !== deletingSubject.id));
    if (expandedSubjectId === deletingSubject.id) {
      setExpandedSubjectId(null);
    }
    if (showToast) showToast(`Subject "${deletingSubject.code}" removed.`);
    setDeletingSubject(null);
  };

  // ---------------------------------------------------------------------------
  // Topic CRUD Handlers
  // ---------------------------------------------------------------------------

  const openAddTopicModal = (subject) => {
    setTargetSubjectForTopic(subject);
    setEditingTopic(null);
    setTopicForm({
      title: '',
      difficulty: 'Medium',
      status: 'Not Started',
    });
    setShowTopicModal(true);
  };

  const openEditTopicModal = (subject, topic) => {
    setTargetSubjectForTopic(subject);
    setEditingTopic(topic);
    setTopicForm({
      title: topic.title,
      difficulty: topic.difficulty || 'Medium',
      status: topic.status || (topic.completed ? 'Completed' : 'Not Started'),
    });
    setShowTopicModal(true);
  };

  const handleSaveTopic = async (e) => {
    e.preventDefault();
    if (!topicForm.title.trim()) {
      if (showToast) showToast('Topic title is required.');
      return;
    }

    const isCompleted = topicForm.status === 'Completed';

    if (editingTopic) {
      // UPDATE Topic
      const updatedTopicData = {
        ...editingTopic,
        title: topicForm.title.trim(),
        difficulty: topicForm.difficulty,
        status: topicForm.status,
        completed: isCompleted,
        subjectId: targetSubjectForTopic.id,
      };

      // Call Spring Boot API
      await apiUpdateTopic(editingTopic.id, updatedTopicData);

      onUpdateSubjects((prev) =>
        prev.map((sub) => {
          if (sub.id !== targetSubjectForTopic.id) return sub;
          const nextTopics = (sub.topics || []).map((t) =>
            t.id === editingTopic.id ? updatedTopicData : t
          );
          const completedCount = nextTopics.filter(
            (t) => t.completed || t.status === 'Completed'
          ).length;
          return {
            ...sub,
            topics: nextTopics,
            completedTopics: completedCount,
            pendingTopics: nextTopics.length - completedCount,
            totalTopics: nextTopics.length,
          };
        })
      );
      if (showToast) showToast(`Topic "${topicForm.title}" updated.`);
    } else {
      // CREATE Topic
      const newTopicPayload = {
        title: topicForm.title.trim(),
        difficulty: topicForm.difficulty,
        status: topicForm.status,
        completed: isCompleted,
        subjectId: targetSubjectForTopic.id,
        orderIndex: (targetSubjectForTopic.topics || []).length + 1,
      };

      // Call Spring Boot API
      const apiResult = await apiCreateTopic(newTopicPayload);
      const newTopic = {
        ...newTopicPayload,
        id: apiResult?.id || `t-${Date.now()}`,
      };

      onUpdateSubjects((prev) =>
        prev.map((sub) => {
          if (sub.id !== targetSubjectForTopic.id) return sub;
          const nextTopics = [...(sub.topics || []), newTopic];
          const completedCount = nextTopics.filter(
            (t) => t.completed || t.status === 'Completed'
          ).length;
          return {
            ...sub,
            topics: nextTopics,
            completedTopics: completedCount,
            pendingTopics: nextTopics.length - completedCount,
            totalTopics: nextTopics.length,
          };
        })
      );
      if (showToast) showToast(`Added topic "${newTopic.title}".`);
    }

    setShowTopicModal(false);
  };

  const handleToggleTopicStatus = async (subjectId, topic) => {
    const nextCompleted = !topic.completed;
    const nextStatus = nextCompleted ? 'Completed' : 'Not Started';

    // Call Spring Boot API
    await apiToggleTopic(topic.id);

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
        return {
          ...sub,
          topics: nextTopics,
          completedTopics: completedCount,
          pendingTopics: nextTopics.length - completedCount,
          totalTopics: nextTopics.length,
        };
      })
    );

    if (showToast) {
      showToast(
        nextCompleted
          ? `Marked "${topic.title}" as Completed! 🎉`
          : `Marked "${topic.title}" as Not Started.`
      );
    }
  };

  const handleUpdateTopicStatusDirectly = async (subjectId, topic, newStatus) => {
    const isCompleted = newStatus === 'Completed';
    const updatedTopic = {
      ...topic,
      status: newStatus,
      completed: isCompleted,
      subjectId,
    };

    // Call Spring Boot API
    await apiUpdateTopic(topic.id, updatedTopic);

    onUpdateSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id !== subjectId) return sub;
        const nextTopics = (sub.topics || []).map((t) =>
          t.id === topic.id ? updatedTopic : t
        );
        const completedCount = nextTopics.filter(
          (t) => t.completed || t.status === 'Completed'
        ).length;
        return {
          ...sub,
          topics: nextTopics,
          completedTopics: completedCount,
          pendingTopics: nextTopics.length - completedCount,
          totalTopics: nextTopics.length,
        };
      })
    );

    if (showToast) showToast(`Topic status updated to ${newStatus}.`);
  };

  const handleDeleteTopic = async () => {
    if (!deletingTopic || !targetSubjectForTopic) return;

    // Call Spring Boot API
    await apiDeleteTopic(deletingTopic.id);

    onUpdateSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id !== targetSubjectForTopic.id) return sub;
        const nextTopics = (sub.topics || []).filter(
          (t) => t.id !== deletingTopic.id
        );
        const completedCount = nextTopics.filter(
          (t) => t.completed || t.status === 'Completed'
        ).length;
        return {
          ...sub,
          topics: nextTopics,
          completedTopics: completedCount,
          pendingTopics: nextTopics.length - completedCount,
          totalTopics: nextTopics.length,
        };
      })
    );

    if (showToast) showToast('Topic deleted from syllabus.');
    setDeletingTopic(null);
  };

  return (
    <div className="view-container">
      {/* Top Header */}
      <div className="view-header">
        <div>
          <h2 className="view-title">My Subjects & Syllabus</h2>
          <p className="view-subtitle">
            Manage your courses, track topic difficulty & progress, and view
            completion metrics
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={openAddSubjectModal}
          title="Add a new academic course"
        >
          <Plus size={16} />
          <span>Add New Subject</span>
        </button>
      </div>

      {/* Ribbon Stats */}
      <div className="planner-summary-ribbon" style={{ marginBottom: '1.5rem' }}>
        <div className="ribbon-card">
          <span className="ribbon-label">Total Subjects</span>
          <span className="ribbon-value text-indigo">{overallStats.totalSubs}</span>
        </div>
        <div className="ribbon-card">
          <span className="ribbon-label">Total Syllabus Topics</span>
          <span className="ribbon-value">{overallStats.totalTopics}</span>
        </div>
        <div className="ribbon-card">
          <span className="ribbon-label">Topics Completed</span>
          <span className="ribbon-value text-emerald">
            {overallStats.completedTopics}
          </span>
        </div>
        <div className="ribbon-card">
          <span className="ribbon-label">Average Completion</span>
          <span className="ribbon-value text-amber">
            {overallStats.completionRate}%
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="view-controls-bar">
        <div className="control-search">
          <Search size={16} className="control-search-icon" />
          <input
            type="text"
            placeholder="Search by code, subject name, or unit..."
            value={subjectSearch}
            onChange={(e) => setSubjectSearch(e.target.value)}
          />
        </div>

        <div className="control-filters">
          <Filter size={16} className="filter-icon" />
          <span className="filter-label">Difficulty:</span>
          {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
            <button
              key={diff}
              className={`filter-pill ${
                filterDifficulty === diff ? 'active' : ''
              }`}
              onClick={() => setFilterDifficulty(diff)}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredSubjects.length === 0 && (
        <div
          className="auth-success-card"
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid var(--border-base)',
            marginTop: '1.5rem',
          }}
        >
          <div className="success-icon-box" style={{ background: '#e0e7ff', color: '#4f46e5' }}>
            <BookOpen size={32} />
          </div>
          <h3>No Subjects Found</h3>
          <p>
            {subjectSearch || filterDifficulty !== 'All'
              ? 'No courses match your current search filters.'
              : 'You do not have any subjects enrolled yet. Add your first course to begin organizing topics!'}
          </p>
          <button className="btn btn-primary" onClick={openAddSubjectModal}>
            <Plus size={16} />
            <span>Add Your First Subject</span>
          </button>
        </div>
      )}

      {/* Subjects Grid */}
      <div className="subjects-grid">
        {filteredSubjects.map((sub) => {
          const topics = sub.topics || [];
          const totalTopicsCount = topics.length;
          const completedTopicsCount = topics.filter(
            (t) => t.completed || t.status === 'Completed'
          ).length;
          const pendingTopicsCount = totalTopicsCount - completedTopicsCount;
          const progressPercent =
            totalTopicsCount > 0
              ? Math.round((completedTopicsCount / totalTopicsCount) * 100)
              : 0;

          const isExpanded = expandedSubjectId === sub.id;

          return (
            <div
              key={sub.id}
              className={`subject-card ${isExpanded ? 'subject-card-expanded' : ''}`}
              style={{
                border: isExpanded ? `2px solid ${sub.color || '#6366f1'}` : undefined,
              }}
            >
              <div
                className="subject-card-accent-bar"
                style={{ backgroundColor: sub.color || '#6366f1' }}
              />

              <div className="subject-card-body">
                {/* Top Badge & Actions Row */}
                <div className="subject-card-top">
                  <div className="subject-badge-group">
                    <span
                      className="subject-tag-code"
                      style={{
                        backgroundColor: sub.bgLight || '#eef2ff',
                        color: sub.color || '#6366f1',
                      }}
                    >
                      {sub.code}
                    </span>
                    <span
                      className={`difficulty-tag diff-${(
                        sub.difficulty || 'Medium'
                      ).toLowerCase()}`}
                    >
                      {sub.difficulty || 'Medium'}
                    </span>
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <button
                      className="icon-action-btn"
                      onClick={() => openEditSubjectModal(sub)}
                      title="Edit Subject"
                      aria-label="Edit Subject"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      className="icon-action-btn"
                      onClick={() => setDeletingSubject(sub)}
                      title="Delete Subject"
                      aria-label="Delete Subject"
                      style={{ color: '#ef4444' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <h3 className="subject-name">{sub.name}</h3>

                {sub.instructor && (
                  <div className="subject-instructor">
                    <User size={14} />
                    <span>{sub.instructor}</span>
                  </div>
                )}

                {sub.currentUnit && (
                  <div className="subject-unit-box">
                    <span className="unit-label">Current Unit</span>
                    <p className="unit-name">{sub.currentUnit}</p>
                  </div>
                )}

                {/* Progress bar */}
                <div className="subject-card-progress-section">
                  <div className="progress-labels">
                    <span className="progress-text-label">
                      Topic Completion ({completedTopicsCount}/{totalTopicsCount})
                    </span>
                    <span className="progress-text-percent">
                      {progressPercent}%
                    </span>
                  </div>
                  <div className="subject-progress-track">
                    <div
                      className="subject-progress-fill"
                      style={{
                        width: `${progressPercent}%`,
                        backgroundColor: sub.color || '#6366f1',
                      }}
                    />
                  </div>
                </div>

                {/* Stats Row */}
                <div className="subject-card-stats-row">
                  <div className="stat-pill">
                    <CheckCircle size={14} className="stat-pill-icon success" />
                    <span>{completedTopicsCount} Done</span>
                  </div>
                  <div className="stat-pill">
                    <Clock size={14} className="stat-pill-icon pending" />
                    <span>{pendingTopicsCount} Left</span>
                  </div>
                  {sub.examDate && (
                    <div className="stat-pill">
                      <Calendar size={14} className="stat-pill-icon" />
                      <span>{sub.examDate.slice(5)}</span>
                    </div>
                  )}
                </div>

                {/* Toggle Topics Drawer Button */}
                <div style={{ marginTop: '0.85rem' }}>
                  <button
                    className={`btn ${
                      isExpanded ? 'btn-secondary' : 'btn-primary'
                    }`}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.85rem',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                    }}
                    onClick={() =>
                      setExpandedSubjectId(isExpanded ? null : sub.id)
                    }
                  >
                    <Layers size={16} />
                    <span>
                      {isExpanded
                        ? 'Hide Topics'
                        : `Manage Topics (${totalTopicsCount})`}
                    </span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>

                {/* =========================================================
                    EXPANDED TOPICS DRAWER (Subject-Wise Topics Management)
                    ========================================================= */}
                {isExpanded && (
                  <div
                    style={{
                      marginTop: '1.25rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid var(--border-base)',
                      animation: 'fadeIn 0.2s ease',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.75rem',
                      }}
                    >
                      <h4
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          color: 'var(--text-main)',
                          margin: 0,
                        }}
                      >
                        Syllabus Topics ({topics.length})
                      </h4>
                      <button
                        className="btn btn-primary"
                        style={{
                          padding: '0.35rem 0.75rem',
                          fontSize: '0.75rem',
                        }}
                        onClick={() => openAddTopicModal(sub)}
                      >
                        <Plus size={14} />
                        <span>Add Topic</span>
                      </button>
                    </div>

                    {/* Topic Filter Pills */}
                    <div
                      style={{
                        display: 'flex',
                        gap: '0.35rem',
                        marginBottom: '0.85rem',
                        overflowX: 'auto',
                      }}
                    >
                      {['All', 'Not Started', 'In Progress', 'Completed'].map(
                        (st) => (
                          <button
                            key={st}
                            type="button"
                            className={`filter-pill ${
                              topicFilterStatus === st ? 'active' : ''
                            }`}
                            style={{
                              fontSize: '0.7rem',
                              padding: '0.2rem 0.6rem',
                            }}
                            onClick={() => setTopicFilterStatus(st)}
                          >
                            {st}
                          </button>
                        )
                      )}
                    </div>

                    {/* Topics List */}
                    {topics.length === 0 ? (
                      <p
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--text-muted)',
                          textAlign: 'center',
                          padding: '1rem 0',
                        }}
                      >
                        No topics added yet. Click &quot;Add Topic&quot; to build the syllabus.
                      </p>
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem',
                          maxHeight: '320px',
                          overflowY: 'auto',
                          paddingRight: '4px',
                        }}
                      >
                        {topics
                          .filter((t) => {
                            if (topicFilterStatus === 'All') return true;
                            const curStatus =
                              t.status || (t.completed ? 'Completed' : 'Not Started');
                            return curStatus === topicFilterStatus;
                          })
                          .map((topic) => {
                            const isDone =
                              topic.completed || topic.status === 'Completed';
                            const currentStatus =
                              topic.status || (isDone ? 'Completed' : 'Not Started');
                            const diffLevel = topic.difficulty || 'Medium';

                            return (
                              <div
                                key={topic.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  gap: '0.5rem',
                                  padding: '0.6rem 0.75rem',
                                  background: isDone
                                    ? '#f0fdf4'
                                    : 'var(--bg-app)',
                                  border: `1px solid ${
                                    isDone ? '#bbf7d0' : 'var(--border-subtle)'
                                  }`,
                                  borderRadius: '8px',
                                }}
                              >
                                {/* Left: Completion checkbox + Title */}
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.55rem',
                                    flex: 1,
                                    minWidth: 0,
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isDone}
                                    onChange={() =>
                                      handleToggleTopicStatus(sub.id, topic)
                                    }
                                    style={{
                                      width: '16px',
                                      height: '16px',
                                      accentColor: 'var(--primary)',
                                      cursor: 'pointer',
                                    }}
                                    title="Toggle completion"
                                  />
                                  <span
                                    style={{
                                      fontSize: '0.82rem',
                                      fontWeight: 500,
                                      color: isDone
                                        ? 'var(--text-muted)'
                                        : 'var(--text-main)',
                                      textDecoration: isDone
                                        ? 'line-through'
                                        : 'none',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                    }}
                                    title={topic.title}
                                  >
                                    {topic.title}
                                  </span>
                                </div>

                                {/* Right: Difficulty Badge + Status Selector + Actions */}
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    flexShrink: 0,
                                  }}
                                >
                                  {/* Difficulty Pill */}
                                  <span
                                    className={`difficulty-tag diff-${diffLevel.toLowerCase()}`}
                                    style={{
                                      fontSize: '0.68rem',
                                      padding: '0.15rem 0.45rem',
                                    }}
                                  >
                                    {diffLevel}
                                  </span>

                                  {/* Status Dropdown */}
                                  <select
                                    value={currentStatus}
                                    onChange={(e) =>
                                      handleUpdateTopicStatusDirectly(
                                        sub.id,
                                        topic,
                                        e.target.value
                                      )
                                    }
                                    style={{
                                      fontSize: '0.72rem',
                                      fontWeight: 600,
                                      padding: '0.2rem 0.45rem',
                                      borderRadius: '6px',
                                      border: '1px solid var(--border-base)',
                                      background:
                                        currentStatus === 'Completed'
                                          ? '#dcfce7'
                                          : currentStatus === 'In Progress'
                                          ? '#e0f2fe'
                                          : '#f3f4f6',
                                      color:
                                        currentStatus === 'Completed'
                                          ? '#166534'
                                          : currentStatus === 'In Progress'
                                          ? '#0369a1'
                                          : '#4b5563',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    <option value="Not Started">Not Started</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                  </select>

                                  {/* Edit Topic */}
                                  <button
                                    className="icon-action-btn"
                                    style={{ padding: '3px' }}
                                    onClick={() =>
                                      openEditTopicModal(sub, topic)
                                    }
                                    title="Edit Topic"
                                  >
                                    <Edit2 size={13} />
                                  </button>

                                  {/* Delete Topic */}
                                  <button
                                    className="icon-action-btn"
                                    style={{ padding: '3px', color: '#ef4444' }}
                                    onClick={() => {
                                      setTargetSubjectForTopic(sub);
                                      setDeletingTopic(topic);
                                    }}
                                    title="Delete Topic"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* =====================================================================
          ADD / EDIT SUBJECT MODAL
          ===================================================================== */}
      {showSubjectModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowSubjectModal(false)}
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}
            >
              <h3 className="modal-title" style={{ margin: 0 }}>
                {editingSubject ? 'Edit Subject' : 'Add New Subject'}
              </h3>
              <button
                className="icon-action-btn"
                onClick={() => setShowSubjectModal(false)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSubject} className="modal-form">
              <div className="form-row">
                <div className="form-group" style={{ flex: '0 0 130px' }}>
                  <label htmlFor="modal-sub-code">Code *</label>
                  <input
                    id="modal-sub-code"
                    type="text"
                    placeholder="e.g. CS201"
                    value={subjectForm.code}
                    onChange={(e) =>
                      setSubjectForm({ ...subjectForm, code: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="modal-sub-name">Subject Name *</label>
                  <input
                    id="modal-sub-name"
                    type="text"
                    placeholder="e.g. Data Structures & Algorithms"
                    value={subjectForm.name}
                    onChange={(e) =>
                      setSubjectForm({ ...subjectForm, name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="modal-sub-instructor">Instructor</label>
                  <input
                    id="modal-sub-instructor"
                    type="text"
                    placeholder="e.g. Dr. Sarah Jenkins"
                    value={subjectForm.instructor}
                    onChange={(e) =>
                      setSubjectForm({
                        ...subjectForm,
                        instructor: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="modal-sub-diff">Difficulty Level</label>
                  <select
                    id="modal-sub-diff"
                    value={subjectForm.difficulty}
                    onChange={(e) =>
                      setSubjectForm({
                        ...subjectForm,
                        difficulty: e.target.value,
                      })
                    }
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="modal-sub-unit">Current Unit / Chapter</label>
                  <input
                    id="modal-sub-unit"
                    type="text"
                    placeholder="e.g. Graph Algorithms & Trees"
                    value={subjectForm.currentUnit}
                    onChange={(e) =>
                      setSubjectForm({
                        ...subjectForm,
                        currentUnit: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="modal-sub-exam">Exam Date</label>
                  <input
                    id="modal-sub-exam"
                    type="date"
                    value={subjectForm.examDate}
                    onChange={(e) =>
                      setSubjectForm({
                        ...subjectForm,
                        examDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Color Theme Selector */}
              <div className="form-group">
                <label>Card Color Accent</label>
                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() =>
                        setSubjectForm({
                          ...subjectForm,
                          color: c.color,
                          bgLight: c.bgLight,
                        })
                      }
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: c.color,
                        border:
                          subjectForm.color === c.color
                            ? '3px solid #111827'
                            : '2px solid transparent',
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease',
                      }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowSubjectModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSubject ? 'Save Changes' : 'Create Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          DELETE SUBJECT CONFIRMATION MODAL
          ===================================================================== */}
      {deletingSubject && (
        <div
          className="modal-backdrop"
          onClick={() => setDeletingSubject(null)}
        >
          <div
            className="modal-card"
            style={{ maxWidth: '420px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                color: '#dc2626',
                marginBottom: '1rem',
              }}
            >
              <AlertCircle size={24} />
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#111827' }}>
                Delete Subject?
              </h3>
            </div>
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
              }}
            >
              Are you sure you want to delete{' '}
              <strong>
                {deletingSubject.code} — {deletingSubject.name}
              </strong>
              ? All {(deletingSubject.topics || []).length} syllabus topics
              under this subject will also be removed.
            </p>
            <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDeletingSubject(null)}
              >
                Keep Subject
              </button>
              <button
                type="button"
                className="btn"
                style={{
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                }}
                onClick={handleDeleteSubject}
              >
                Delete Subject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          ADD / EDIT TOPIC MODAL
          ===================================================================== */}
      {showTopicModal && (
        <div className="modal-backdrop" onClick={() => setShowTopicModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}
            >
              <div>
                <h3 className="modal-title" style={{ margin: 0 }}>
                  {editingTopic ? 'Edit Topic' : 'Add Topic to Syllabus'}
                </h3>
                <span
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  Course: {targetSubjectForTopic?.code} (
                  {targetSubjectForTopic?.name})
                </span>
              </div>
              <button
                className="icon-action-btn"
                onClick={() => setShowTopicModal(false)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTopic} className="modal-form">
              <div className="form-group">
                <label htmlFor="modal-topic-title">Topic / Chapter Title *</label>
                <input
                  id="modal-topic-title"
                  type="text"
                  placeholder="e.g. Dynamic Programming & 0/1 Knapsack"
                  value={topicForm.title}
                  onChange={(e) =>
                    setTopicForm({ ...topicForm, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="modal-topic-diff">Difficulty Level</label>
                  <select
                    id="modal-topic-diff"
                    value={topicForm.difficulty}
                    onChange={(e) =>
                      setTopicForm({
                        ...topicForm,
                        difficulty: e.target.value,
                      })
                    }
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="modal-topic-status">Initial Status</label>
                  <select
                    id="modal-topic-status"
                    value={topicForm.status}
                    onChange={(e) =>
                      setTopicForm({
                        ...topicForm,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowTopicModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTopic ? 'Save Changes' : 'Add to Syllabus'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          DELETE TOPIC CONFIRMATION MODAL
          ===================================================================== */}
      {deletingTopic && (
        <div className="modal-backdrop" onClick={() => setDeletingTopic(null)}>
          <div
            className="modal-card"
            style={{ maxWidth: '400px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                color: '#dc2626',
                marginBottom: '1rem',
              }}
            >
              <AlertCircle size={22} />
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#111827' }}>
                Remove Topic?
              </h3>
            </div>
            <p
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
              }}
            >
              Are you sure you want to remove &quot;{deletingTopic.title}&quot; from{' '}
              {targetSubjectForTopic?.code}?
            </p>
            <div className="modal-actions" style={{ marginTop: '1.25rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDeletingTopic(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn"
                style={{
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                }}
                onClick={handleDeleteTopic}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
