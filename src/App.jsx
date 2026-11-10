import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import SubjectsView from './components/SubjectsView';
import StudyPlannerView from './components/StudyPlannerView';
import ProgressTrackerView from './components/ProgressTrackerView';
import RevisionScheduleView from './components/RevisionScheduleView';
import AuthPage from './components/auth/AuthPage';
import {
  getSession,
  loginUser,
  registerUser,
  logoutUser,
} from './utils/auth';
import {
  apiFetchSubjects,
  apiFetchTasks,
  apiCreateTask,
  apiUpdateTask,
  apiToggleTask,
  apiDeleteTask,
} from './utils/api';
import {
  studentProfile as demoProfile,
  subjects as initialSubjects,
  todayTasks as initialTasks,
  upcomingExams,
  revisionItems as initialRevisions,
} from './data/sampleData';

function loadStudentSubjects(user) {
  if (!user) return [];
  const stored = localStorage.getItem(`smart_study_subjects_${user.id}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // ignore
    }
  }
  const isDemo = user.email?.toLowerCase() === 'alex.morgan@university.edu';
  return isDemo ? initialSubjects : [];
}

function loadStudentTasks(user) {
  if (!user) return [];
  const stored = localStorage.getItem(`smart_study_tasks_${user.id}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // ignore
    }
  }
  const isDemo = user.email?.toLowerCase() === 'alex.morgan@university.edu';
  return isDemo ? initialTasks : [];
}

function loadStudentRevisions(user) {
  if (!user) return [];
  const stored = localStorage.getItem(`smart_study_revisions_${user.id}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // ignore
    }
  }
  return initialRevisions;
}

export default function App() {
  // --- Auth State (always first) -------------------------------------------
  const [currentUser, setCurrentUser] = useState(() => getSession());

  // --- Dashboard State (always declared — Rules of Hooks requires this) -----
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasksState] = useState(() => loadStudentTasks(currentUser));
  const [subjects, setSubjectsState] = useState(() =>
    loadStudentSubjects(currentUser)
  );
  const [revisions, setRevisionsState] = useState(() =>
    loadStudentRevisions(currentUser)
  );
  const [toastMessage, setToastMessage] = useState(null);

  // Sync subjects state with localStorage per student
  const setSubjects = (updater) => {
    setSubjectsState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (currentUser?.id) {
        localStorage.setItem(
          `smart_study_subjects_${currentUser.id}`,
          JSON.stringify(next)
        );
      }
      return next;
    });
  };

  // Sync tasks state with localStorage per student
  const setTasks = (updater) => {
    setTasksState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (currentUser?.id) {
        localStorage.setItem(
          `smart_study_tasks_${currentUser.id}`,
          JSON.stringify(next)
        );
      }
      return next;
    });
  };

  // Sync revision items state with localStorage per student
  const setRevisions = (updater) => {
    setRevisionsState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (currentUser?.id) {
        localStorage.setItem(
          `smart_study_revisions_${currentUser.id}`,
          JSON.stringify(next)
        );
      }
      return next;
    });
  };

  // Fetch student subjects and tasks from Spring Boot backend on mount or login
  useEffect(() => {
    if (!currentUser?.id) return;
    let isMounted = true;

    // 1. Fetch subjects
    apiFetchSubjects(currentUser.id)
      .then((serverSubs) => {
        if (
          isMounted &&
          serverSubs &&
          Array.isArray(serverSubs) &&
          serverSubs.length > 0
        ) {
          setSubjectsState(serverSubs);
          localStorage.setItem(
            `smart_study_subjects_${currentUser.id}`,
            JSON.stringify(serverSubs)
          );
        }
      })
      .catch(() => {});

    // 2. Fetch tasks from MySQL
    apiFetchTasks(currentUser.id)
      .then((serverTasks) => {
        if (
          isMounted &&
          serverTasks &&
          Array.isArray(serverTasks) &&
          serverTasks.length > 0
        ) {
          const formatted = serverTasks.map((t) => ({
            id: t.id,
            subjectCode: t.subjectCode || 'CS201',
            title: t.title,
            duration: `${t.durationMinutes || 45} mins`,
            time: t.scheduledTime || '02:00 PM',
            completed: t.completed,
            priority:
              (t.priority || 'MEDIUM').charAt(0) +
              (t.priority || 'medium').slice(1).toLowerCase(),
            subjectId: t.subjectId,
          }));
          setTasksState(formatted);
          localStorage.setItem(
            `smart_study_tasks_${currentUser.id}`,
            JSON.stringify(formatted)
          );
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [currentUser?.id]);

  // --- Auth Handlers --------------------------------------------------------
  const handleLogin = async (email, password, rememberMe) => {
    const result = await loginUser(email, password, rememberMe);
    if (result && result.success) {
      setCurrentUser(result.user);
      setSubjectsState(loadStudentSubjects(result.user));
      setTasksState(loadStudentTasks(result.user));
      setRevisionsState(loadStudentRevisions(result.user));
    }
    return result;
  };

  const handleRegister = async ({ name, email, password }) => {
    const result = await registerUser({ name, email, password });
    // After registration, do not automatically log in. Redirect to Login page instead.
    return result;
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  // --- Show Auth Page when not logged in ------------------------------------
  if (!currentUser) {
    return <AuthPage onLogin={handleLogin} onRegister={handleRegister} />;
  }

  // --- Build student profile: use demo data for Alex, minimal for others ----
  const isDemo =
    currentUser.email.toLowerCase() === 'alex.morgan@university.edu';
  const studentProfile = isDemo
    ? demoProfile
    : {
        name: currentUser.name,
        avatar: currentUser.avatar,
        course: currentUser.course,
        semester: currentUser.semester,
        targetGPA: 'N/A',
        streakDays: currentUser.streakDays ?? 0,
        weeklyGoalHours: 20,
        completedHoursThisWeek: 0,
      };

  // --- Task Handlers (MySQL Backend + Local Persistence) --------------------
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleTask = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextState = !t.completed;
          showToast(
            nextState
              ? `Completed: "${t.title}" 🎉`
              : `Marked "${t.title}" pending`
          );
          // Persist toggle status in MySQL
          if (typeof taskId === 'number' || !isNaN(Number(taskId))) {
            apiToggleTask(taskId).catch(() => {});
          }
          return { ...t, completed: nextState };
        }
        return t;
      })
    );
  };

  const handleAddTask = async (newTask) => {
    const studentId = currentUser?.id || 1;
    const foundSub = subjects.find((s) => s.code === newTask.subjectCode);
    const durationNum = parseInt(newTask.duration) || 45;

    const payload = {
      title: newTask.title,
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: newTask.time || '03:00 PM',
      durationMinutes: durationNum,
      priority: (newTask.priority || 'MEDIUM').toUpperCase(),
      completed: false,
      studentId: typeof studentId === 'number' ? studentId : 1,
      subjectId: foundSub?.id && typeof foundSub.id === 'number' ? foundSub.id : null,
    };

    let createdId = newTask.id;
    try {
      const saved = await apiCreateTask(payload);
      if (saved && saved.id) {
        createdId = saved.id;
      }
    } catch {
      // fallback
    }

    const taskToAdd = { ...newTask, id: createdId };
    setTasks((prev) => [taskToAdd, ...prev]);
    showToast(`Added new task: "${newTask.title}"`);
  };

  const handleEditTask = async (updatedTask) => {
    if (typeof updatedTask.id === 'number' || !isNaN(Number(updatedTask.id))) {
      const studentId = currentUser?.id || 1;
      const foundSub = subjects.find((s) => s.code === updatedTask.subjectCode);
      const durationNum = parseInt(updatedTask.duration) || 45;

      const payload = {
        title: updatedTask.title,
        scheduledDate: new Date().toISOString().split('T')[0],
        scheduledTime: updatedTask.time || '03:00 PM',
        durationMinutes: durationNum,
        priority: (updatedTask.priority || 'MEDIUM').toUpperCase(),
        completed: updatedTask.completed,
        studentId: typeof studentId === 'number' ? studentId : 1,
        subjectId: foundSub?.id && typeof foundSub.id === 'number' ? foundSub.id : null,
      };
      apiUpdateTask(updatedTask.id, payload).catch(() => {});
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    showToast(`Updated task: "${updatedTask.title}"`);
  };

  const handleDeleteTask = (taskId) => {
    if (typeof taskId === 'number' || !isNaN(Number(taskId))) {
      apiDeleteTask(taskId).catch(() => {});
    }
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast('Task removed from schedule');
  };

  const handleQuickAction = (action) => {
    if (action === 'start-session') {
      showToast('🚀 Focus Session started! 25-minute Pomodoro timer running.');
    } else if (action === 'add-task') {
      setActiveTab('planner');
    }
  };

  // --- Live Metrics ---------------------------------------------------------
  let totalCompletedTopics = 0;
  let totalPendingTopics = 0;

  subjects.forEach((s) => {
    const topics = s.topics || [];
    const completed = topics.filter(
      (t) => t.completed || t.status === 'Completed'
    ).length;
    totalCompletedTopics += completed;
    totalPendingTopics += topics.length - completed;
  });

  const totalTopicsCount = totalCompletedTopics + totalPendingTopics;
  const overallPercentage =
    totalTopicsCount > 0
      ? Math.round((totalCompletedTopics / totalTopicsCount) * 100)
      : 0;

  const liveMetrics = {
    totalSubjects: subjects.length,
    completedTopics: totalCompletedTopics,
    pendingTopics: totalPendingTopics,
    upcomingExams: upcomingExams.length,
    overallProgress: overallPercentage,
  };

  // --- Dashboard Layout -----------------------------------------------------
  return (
    <div className="app-layout">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        studentProfile={studentProfile}
        onLogout={handleLogout}
      />

      <div className="main-wrapper">
        <Header
          onMenuClick={() => setIsSidebarOpen(true)}
          studentProfile={studentProfile}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onLogout={handleLogout}
        />

        <main className="content-area">
          {activeTab === 'dashboard' && (
            <DashboardView
              studentProfile={studentProfile}
              metrics={liveMetrics}
              subjects={subjects}
              tasks={tasks}
              upcomingExams={upcomingExams}
              revisionItems={revisions}
              onToggleTask={handleToggleTask}
              onNavigateTab={setActiveTab}
              onQuickAction={handleQuickAction}
            />
          )}

          {activeTab === 'subjects' && (
            <SubjectsView
              subjects={subjects}
              currentUser={currentUser}
              onUpdateSubjects={setSubjects}
              showToast={showToast}
            />
          )}

          {activeTab === 'planner' && (
            <StudyPlannerView
              tasks={tasks}
              subjects={subjects}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {activeTab === 'progress' && (
            <ProgressTrackerView
              studentProfile={studentProfile}
              metrics={liveMetrics}
              subjects={subjects}
              onUpdateSubjects={setSubjects}
              showToast={showToast}
            />
          )}

          {activeTab === 'revision' && (
            <RevisionScheduleView
              revisionItems={revisions}
              onUpdateRevisions={setRevisions}
              subjects={subjects}
            />
          )}
        </main>
      </div>

      {toastMessage && (
        <div className="app-toast" role="status" aria-live="polite">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
