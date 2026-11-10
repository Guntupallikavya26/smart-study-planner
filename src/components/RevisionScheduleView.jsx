import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  Clock,
  Plus,
  Trash2,
  Calendar,
  X,
} from 'lucide-react';

export default function RevisionScheduleView({
  revisionItems = [],
  onUpdateRevisions,
  subjects = [],
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTopic, setNewTopic] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState(subjects[0]?.code || 'CS201');
  const [newStage, setNewStage] = useState('Day 1 Review');
  const [newDueDate, setNewDueDate] = useState('Today');
  const [newConfidence, setNewConfidence] = useState('Moderate');

  const handleMarkReviewed = (id) => {
    const updated = revisionItems.map((item) =>
      item.id === id
        ? {
            ...item,
            status: 'Completed',
            confidence: 'Mastered',
            dueDate: 'Completed Today',
          }
        : item
    );
    if (onUpdateRevisions) {
      onUpdateRevisions(updated);
    }
  };

  const handleDeleteRevision = (id) => {
    const updated = revisionItems.filter((item) => item.id !== id);
    if (onUpdateRevisions) {
      onUpdateRevisions(updated);
    }
  };

  const handleCreateRevision = (e) => {
    e.preventDefault();
    if (!newTopic.trim()) return;

    const newItem = {
      id: `rev-${Date.now()}`,
      subjectCode: newSubjectCode,
      topic: newTopic.trim(),
      stage: newStage,
      dueDate: newDueDate,
      status: newDueDate === 'Today' ? 'Due' : 'Scheduled',
      confidence: newConfidence,
    };

    const updated = [newItem, ...revisionItems];
    if (onUpdateRevisions) {
      onUpdateRevisions(updated);
    }

    setNewTopic('');
    setShowAddModal(false);
  };

  const dueItems = revisionItems.filter((i) => i.status === 'Due');
  const scheduledItems = revisionItems.filter((i) => i.status === 'Scheduled');
  const completedItems = revisionItems.filter((i) => i.status === 'Completed');

  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <h2 className="view-title">Revision Schedule</h2>
          <p className="view-subtitle">
            Scientific spaced repetition schedule designed to maximize long-term retention
          </p>
        </div>
        <div className="header-actions-row">
          <div className="revision-cycle-badge">
            <Sparkles size={16} />
            <span>Active Repetition Method: 1-3-7-14 Days</span>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} />
            <span>Schedule Revision</span>
          </button>
        </div>
      </div>

      {/* Explanation Banner */}
      <div className="revision-intro-banner">
        <div className="intro-text">
          <strong>How Spaced Repetition Works:</strong> Review topics at increasing intervals
          (Day 1 &rarr; Day 3 &rarr; Day 7 &rarr; Day 14) to combat the Ebbinghaus forgetting curve.
        </div>
      </div>

      {/* Due Today Section */}
      <div className="revision-section">
        <div className="section-title-row">
          <div className="section-title-group">
            <span className="due-pulse-indicator" />
            <h3 className="section-heading">Due for Review Today</h3>
          </div>
          <span className="badge-count badge-due">{dueItems.length} Due</span>
        </div>

        {dueItems.length === 0 ? (
          <div className="empty-state-card">
            <Check size={32} className="empty-icon success" />
            <p>Awesome! You have finished all revisions due today.</p>
          </div>
        ) : (
          <div className="revision-cards-grid">
            {dueItems.map((item) => (
              <div key={item.id} className="revision-card due-card">
                <div className="revision-card-header">
                  <span className="revision-code-badge">{item.subjectCode}</span>
                  <span className="revision-stage-chip">{item.stage}</span>
                </div>

                <h4 className="revision-card-topic">{item.topic}</h4>

                <div className="revision-card-meta">
                  <span className="confidence-tag">Confidence: {item.confidence}</span>
                  <span className="due-tag-urgent">Due Today</span>
                </div>

                <div className="revision-card-actions">
                  <button
                    className="btn btn-primary btn-full-width"
                    onClick={() => handleMarkReviewed(item.id)}
                  >
                    <Check size={16} />
                    <span>Mark as Revised</span>
                  </button>
                  <button
                    className="delete-revision-btn"
                    onClick={() => handleDeleteRevision(item.id)}
                    title="Remove from schedule"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Revisions Section */}
      <div className="revision-section">
        <div className="section-title-row">
          <h3 className="section-heading">Upcoming Scheduled Revisions</h3>
          <span className="badge-count">{scheduledItems.length} Scheduled</span>
        </div>

        {scheduledItems.length === 0 ? (
          <div className="empty-state-card">
            <Calendar size={32} className="empty-icon" />
            <p>No upcoming revisions scheduled. Use "Schedule Revision" to plan ahead.</p>
          </div>
        ) : (
          <div className="revision-cards-grid">
            {scheduledItems.map((item) => (
              <div key={item.id} className="revision-card">
                <div className="revision-card-header">
                  <span className="revision-code-badge">{item.subjectCode}</span>
                  <span className="revision-stage-chip">{item.stage}</span>
                </div>

                <h4 className="revision-card-topic">{item.topic}</h4>

                <div className="revision-card-meta">
                  <span className="confidence-tag">Confidence: {item.confidence}</span>
                  <span className="due-tag-scheduled">
                    <Clock size={12} /> {item.dueDate}
                  </span>
                </div>

                <div className="revision-card-actions">
                  <button
                    className="btn btn-secondary btn-full-width"
                    onClick={() => handleMarkReviewed(item.id)}
                  >
                    <span>Review Early</span>
                  </button>
                  <button
                    className="delete-revision-btn"
                    onClick={() => handleDeleteRevision(item.id)}
                    title="Remove from schedule"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recently Completed */}
      {completedItems.length > 0 && (
        <div className="revision-section">
          <div className="section-title-row">
            <h3 className="section-heading">Completed Revisions</h3>
            <span className="badge-count badge-success">{completedItems.length} Done</span>
          </div>

          <div className="revision-cards-grid">
            {completedItems.map((item) => (
              <div key={item.id} className="revision-card completed-card">
                <div className="revision-card-header">
                  <span className="revision-code-badge">{item.subjectCode}</span>
                  <span className="badge-completed">Revised</span>
                </div>
                <h4 className="revision-card-topic">{item.topic}</h4>
                <div className="revision-card-meta">
                  <span className="confidence-tag mastered">Mastered</span>
                  <span className="due-tag-done">{item.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Revision Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3 className="modal-title">Schedule Spaced Revision</h3>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateRevision} className="modal-form">
              <div className="form-group">
                <label>Topic / Chapter to Revise</label>
                <input
                  type="text"
                  placeholder="e.g. Dijkstra's Shortest Path or Paging Tables"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Subject</label>
                  <select
                    value={newSubjectCode}
                    onChange={(e) => setNewSubjectCode(e.target.value)}
                  >
                    {subjects.length > 0 ? (
                      subjects.map((s) => (
                        <option key={s.id} value={s.code}>
                          {s.code} - {s.name}
                        </option>
                      ))
                    ) : (
                      <option value="CS201">CS201 - Data Structures</option>
                    )}
                  </select>
                </div>

                <div className="form-group">
                  <label>Spaced Interval Stage</label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value)}
                  >
                    <option value="Day 1 Review">Day 1 Review (Initial Recall)</option>
                    <option value="Day 3 Review">Day 3 Review (Reinforcement)</option>
                    <option value="Day 7 Review">Day 7 Review (Deep Storage)</option>
                    <option value="Day 14 Final">Day 14 Final (Exam Retention)</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Target Review Date</label>
                  <select
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                  >
                    <option value="Today">Due Today</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="In 3 Days">In 3 Days</option>
                    <option value="In 7 Days">In 7 Days</option>
                    <option value="In 14 Days">In 14 Days</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Current Confidence</label>
                  <select
                    value={newConfidence}
                    onChange={(e) => setNewConfidence(e.target.value)}
                  >
                    <option value="Low">Low (Needs Practice)</option>
                    <option value="Moderate">Moderate (Review Formulas)</option>
                    <option value="High">High (Quick Refresh)</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Sparkles size={16} />
                  <span>Save to Schedule</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
