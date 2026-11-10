import React, { useState } from 'react';
import {
  Plus,
  Clock,
  CheckCircle2,
  Circle,
  Calendar,
  Filter,
  Check,
  Trash2,
  Edit2,
} from 'lucide-react';

export default function StudyPlannerView({
  tasks,
  subjects,
  onToggleTask,
  onAddTask,
  onEditTask,
  onDeleteTask,
}) {
  const [filterPriority, setFilterPriority] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState(subjects[0]?.code || 'CS201');
  const [newTaskDuration, setNewTaskDuration] = useState('45 mins');
  const [newTaskTime, setNewTaskTime] = useState('03:00 PM');
  const [newTaskPriority, setNewTaskPriority] = useState('Medium');

  const filteredTasks = tasks.filter((t) => {
    if (filterPriority === 'All') return true;
    return t.priority === filterPriority;
  });

  const handleOpenAddModal = () => {
    setEditingTask(null);
    setNewTaskTitle('');
    setNewTaskSubject(subjects[0]?.code || 'CS201');
    setNewTaskDuration('45 mins');
    setNewTaskTime('03:00 PM');
    setNewTaskPriority('Medium');
    setShowAddModal(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setNewTaskTitle(task.title);
    setNewTaskSubject(task.subjectCode);
    setNewTaskDuration(task.duration || '45 mins');
    setNewTaskTime(task.time || '03:00 PM');
    setNewTaskPriority(task.priority || 'Medium');
    setShowAddModal(true);
  };

  const handleCreateOrUpdateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    if (editingTask && onEditTask) {
      onEditTask({
        ...editingTask,
        subjectCode: newTaskSubject,
        title: newTaskTitle.trim(),
        duration: newTaskDuration,
        time: newTaskTime,
        priority: newTaskPriority,
      });
    } else if (onAddTask) {
      onAddTask({
        id: `task-${Date.now()}`,
        subjectCode: newTaskSubject,
        title: newTaskTitle.trim(),
        duration: newTaskDuration,
        time: newTaskTime,
        completed: false,
        priority: newTaskPriority,
      });
    }

    setNewTaskTitle('');
    setEditingTask(null);
    setShowAddModal(false);
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <h2 className="view-title">Study Planner</h2>
          <p className="view-subtitle">
            Plan daily study sessions, organize time blocks, and track completed tasks
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleOpenAddModal}
        >
          <Plus size={16} />
          <span>Add Study Task</span>
        </button>
      </div>

      {/* Summary ribbon */}
      <div className="planner-summary-ribbon">
        <div className="ribbon-card">
          <span className="ribbon-label">Total Planned</span>
          <span className="ribbon-value">{tasks.length} Tasks</span>
        </div>
        <div className="ribbon-card">
          <span className="ribbon-label">Completed</span>
          <span className="ribbon-value text-emerald">{completedCount} Tasks</span>
        </div>
        <div className="ribbon-card">
          <span className="ribbon-label">Remaining</span>
          <span className="ribbon-value text-amber">
            {tasks.length - completedCount} Tasks
          </span>
        </div>
        <div className="ribbon-card">
          <span className="ribbon-label">Completion Rate</span>
          <span className="ribbon-value text-indigo">
            {tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="view-controls-bar">
        <div className="control-filters">
          <Filter size={16} className="filter-icon" />
          <span className="filter-label">Priority:</span>
          {['All', 'High', 'Medium', 'Low'].map((p) => (
            <button
              key={p}
              className={`filter-pill ${filterPriority === p ? 'active' : ''}`}
              onClick={() => setFilterPriority(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks list */}
      <div className="planner-tasks-container">
        {filteredTasks.length === 0 ? (
          <div className="empty-state-card">
            <Calendar size={36} className="empty-icon" />
            <p>No study tasks found for this filter.</p>
          </div>
        ) : (
          <div className="planner-task-items">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`planner-item-row ${
                  task.completed ? 'planner-item-completed' : ''
                }`}
              >
                <button
                  className="planner-check-btn"
                  onClick={() => onToggleTask(task.id)}
                  aria-label="Toggle task completion"
                >
                  {task.completed ? (
                    <CheckCircle2 size={22} className="check-icon done" />
                  ) : (
                    <Circle size={22} className="check-icon" />
                  )}
                </button>

                <div className="planner-item-body">
                  <div className="planner-item-header">
                    <span className="task-subject-tag">{task.subjectCode}</span>
                    <span className="planner-time-tag">
                      <Clock size={13} /> {task.time} • {task.duration}
                    </span>
                    <span
                      className={`priority-pill priority-${task.priority.toLowerCase()}`}
                    >
                      {task.priority} Priority
                    </span>
                  </div>
                  <h4 className="planner-task-heading">{task.title}</h4>
                </div>

                <div className="planner-item-actions">
                  {onEditTask && (
                    <button
                      className="edit-task-btn"
                      onClick={() => handleOpenEditModal(task)}
                      title="Edit task"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                  {onDeleteTask && (
                    <button
                      className="delete-task-btn"
                      onClick={() => onDeleteTask(task.id)}
                      title="Delete task"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Task Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">{editingTask ? 'Edit Study Task' : 'Add Study Task'}</h3>
            <form onSubmit={handleCreateOrUpdateTask} className="modal-form">
              <div className="form-group">
                <label>Task / Topic Title</label>
                <input
                  type="text"
                  placeholder="e.g. Practice Dynamic Programming Memoization"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Subject</label>
                  <select
                    value={newTaskSubject}
                    onChange={(e) => setNewTaskSubject(e.target.value)}
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.code}>
                        {s.code} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Time of Day</label>
                  <input
                    type="text"
                    value={newTaskTime}
                    onChange={(e) => setNewTaskTime(e.target.value)}
                    placeholder="e.g. 04:00 PM"
                  />
                </div>

                <div className="form-group">
                  <label>Estimated Duration</label>
                  <input
                    type="text"
                    value={newTaskDuration}
                    onChange={(e) => setNewTaskDuration(e.target.value)}
                    placeholder="e.g. 45 mins"
                  />
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
                  <Check size={16} />
                  <span>Save Task</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

