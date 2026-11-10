import React from 'react';
import WelcomeBanner from './WelcomeBanner';
import SummaryCards from './SummaryCards';
import MlInsightsSection from './MlInsightsSection';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  ArrowRight,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function DashboardView({
  studentProfile,
  metrics,
  subjects,
  tasks,
  upcomingExams,
  revisionItems,
  onToggleTask,
  onNavigateTab,
  onQuickAction,
}) {
  const completedTasksCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="dashboard-view-content">
      {/* Welcome Banner */}
      <WelcomeBanner
        studentProfile={studentProfile}
        onQuickAction={onQuickAction}
        todayCompletedCount={completedTasksCount}
        todayTotalCount={tasks.length}
      />

      {/* Summary Metrics Cards */}
      <SummaryCards
        metrics={metrics}
        onCardClick={(cardId) => {
          if (cardId === 'subjects') onNavigateTab('subjects');
          else if (cardId === 'completed' || cardId === 'pending') onNavigateTab('progress');
          else if (cardId === 'exams') onNavigateTab('planner');
        }}
      />

      {/* AI Study Intelligence & Machine Learning Diagnostics */}
      <MlInsightsSection
        studentProfile={studentProfile}
        subjects={subjects}
        onNavigateTab={onNavigateTab}
      />

      {/* Main Grid: Today's Tasks & Upcoming Exams */}
      <div className="dashboard-grid-two-col">
        {/* Left Column: Today's Study Plan */}
        <div className="dashboard-card">
          <div className="card-header-row">
            <div>
              <h3 className="card-heading">Today's Study Plan</h3>
              <p className="card-subheading">
                {completedTasksCount} of {tasks.length} tasks completed today
              </p>
            </div>
            <button
              className="text-link-btn"
              onClick={() => onNavigateTab('planner')}
            >
              <span>View All</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="task-list">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`task-item ${task.completed ? 'task-item-completed' : ''}`}
                onClick={() => onToggleTask(task.id)}
              >
                <button
                  className="task-checkbox-btn"
                  aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
                >
                  {task.completed ? (
                    <CheckCircle2 size={20} className="checkbox-icon checked" />
                  ) : (
                    <Circle size={20} className="checkbox-icon" />
                  )}
                </button>

                <div className="task-info">
                  <div className="task-meta-row">
                    <span className="task-subject-tag">{task.subjectCode}</span>
                    <span className="task-time">
                      <Clock size={12} />
                      {task.time} ({task.duration})
                    </span>
                    <span
                      className={`priority-pill priority-${task.priority.toLowerCase()}`}
                    >
                      {task.priority} Priority
                    </span>
                  </div>
                  <span className="task-title-text">{task.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Upcoming Exams Countdown */}
        <div className="dashboard-card">
          <div className="card-header-row">
            <div>
              <h3 className="card-heading">Upcoming Exams</h3>
              <p className="card-subheading">Keep track of your exam preparation schedule</p>
            </div>
            <span className="badge-count">{upcomingExams.length} Exams</span>
          </div>

          <div className="exams-list">
            {upcomingExams.map((exam) => (
              <div key={exam.id} className="exam-card-item">
                <div
                  className="exam-color-bar"
                  style={{ backgroundColor: exam.color }}
                />
                <div className="exam-details">
                  <div className="exam-top-row">
                    <span className="exam-code-tag">{exam.subjectCode}</span>
                    <span
                      className={`exam-countdown-pill ${
                        exam.daysLeft <= 7 ? 'countdown-urgent' : 'countdown-normal'
                      }`}
                    >
                      {exam.daysLeft === 1
                        ? 'Tomorrow'
                        : `${exam.daysLeft} days left`}
                    </span>
                  </div>
                  <h4 className="exam-name">{exam.subjectName}</h4>
                  <div className="exam-meta">
                    <span>
                      <Calendar size={13} /> {exam.date}
                    </span>
                    <span>•</span>
                    <span>{exam.room}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Exam Tip */}
          <div className="exam-quick-alert">
            <AlertCircle size={16} className="alert-icon" />
            <p>First exam starts in 6 days! Prioritize high-weight topics first.</p>
          </div>
        </div>
      </div>

      {/* Secondary Grid: Subject Progress & Revision Queue */}
      <div className="dashboard-grid-two-col">
        {/* Subject Progress Overview */}
        <div className="dashboard-card">
          <div className="card-header-row">
            <div>
              <h3 className="card-heading">Subject Progress</h3>
              <p className="card-subheading">Topic completion breakdown across subjects</p>
            </div>
            <button
              className="text-link-btn"
              onClick={() => onNavigateTab('subjects')}
            >
              <span>Manage Subjects</span>
              <ChevronRight size={15} />
            </button>
          </div>

          <div className="subject-progress-list">
            {subjects.map((sub) => {
              const percent = Math.round((sub.completedTopics / sub.totalTopics) * 100);
              return (
                <div key={sub.id} className="subject-progress-row">
                  <div className="subject-row-header">
                    <div className="subject-title-group">
                      <span
                        className="subject-dot"
                        style={{ backgroundColor: sub.color }}
                      />
                      <span className="subject-code-strong">{sub.code}:</span>
                      <span className="subject-title-label">{sub.name}</span>
                    </div>
                    <div className="subject-percent-badge">
                      <span>{percent}%</span>
                      <span className="topic-counts">
                        ({sub.completedTopics}/{sub.totalTopics} topics)
                      </span>
                    </div>
                  </div>
                  <div className="subject-progress-track">
                    <div
                      className="subject-progress-fill"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: sub.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Spaced Revision Queue */}
        <div className="dashboard-card">
          <div className="card-header-row">
            <div>
              <h3 className="card-heading">Spaced Repetition Queue</h3>
              <p className="card-subheading">Retention booster based on spaced review</p>
            </div>
            <button
              className="text-link-btn"
              onClick={() => onNavigateTab('revision')}
            >
              <span>View Schedule</span>
              <ChevronRight size={15} />
            </button>
          </div>

          <div className="revision-queue-list">
            {revisionItems.slice(0, 3).map((item) => (
              <div key={item.id} className="revision-queue-item">
                <div className="revision-item-header">
                  <span className="revision-code-badge">{item.subjectCode}</span>
                  <span
                    className={`revision-due-tag ${
                      item.dueDate === 'Today' ? 'tag-due-today' : 'tag-due-later'
                    }`}
                  >
                    {item.dueDate}
                  </span>
                </div>
                <h4 className="revision-topic-name">{item.topic}</h4>
                <div className="revision-footer-row">
                  <span className="revision-stage">
                    <Sparkles size={13} /> {item.stage}
                  </span>
                  <span className="confidence-pill">Confidence: {item.confidence}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
