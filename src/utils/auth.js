// Authentication utility — uses Spring Boot MySQL REST API with session persistence.

import { apiLogin, apiRegister } from './api';

const USERS_KEY = 'smart_study_users';
const SESSION_KEY = 'smart_study_session';
const SESSION_REMEMBER_KEY = 'smart_study_session_remember';

/** Pre-seeded demo student that matches sampleData.js and MySQL DataSeeder (id=1) */
const DEMO_USER = {
  id: 1,
  name: 'Alex Morgan',
  email: 'alex.morgan@university.edu',
  password: 'password123',
  avatar:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  course: 'B.Tech Computer Science & Engineering',
  semester: 'Semester 4',
  streakDays: 7,
};

/** Load cached users from localStorage for offline fallback. */
function loadCachedUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const hasDemo = parsed.some((u) => u.id === DEMO_USER.id);
      return hasDemo ? parsed : [DEMO_USER, ...parsed];
    }
  } catch {
    // ignore corrupt data
  }
  return [DEMO_USER];
}

/** Cache user to localStorage for offline fallback. */
function cacheUser(user) {
  try {
    const users = loadCachedUsers();
    const index = users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
    if (index >= 0) {
      users[index] = { ...users[index], ...user };
    } else {
      users.push(user);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    // ignore storage error
  }
}

/**
 * Attempt to log in against the Spring Boot MySQL backend.
 * Falls back to local offline cache only if server is unreachable.
 *
 * @param {string} email
 * @param {string} password
 * @param {boolean} rememberMe — if true, persist across browser restarts
 * @returns {Promise<{ success: boolean, user?: object, message?: string }>}
 */
export async function loginUser(email, password, rememberMe = true) {
  const cleanEmail = email.trim().toLowerCase();

  // 1. Primary: Verify credentials against Spring Boot MySQL API
  const apiRes = await apiLogin(cleanEmail, password);

  if (apiRes.success && apiRes.data) {
    const student = apiRes.data;
    const safeUser = {
      id: student.id,
      name: student.fullName,
      email: student.email,
      course: student.course || 'B.Tech Computer Science & Engineering',
      semester: student.semester || 'Semester 4',
      avatar:
        student.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(student.fullName)}&background=6366f1&color=fff&size=250`,
      streakDays: student.streakDays ?? (cleanEmail === DEMO_USER.email.toLowerCase() ? 7 : 0),
    };

    saveSession(safeUser, rememberMe);
    cacheUser({ ...safeUser, password });
    return { success: true, user: safeUser };
  }

  // If server explicitly rejected credentials (e.g. 401 Unauthorized)
  if (apiRes.message && !apiRes.networkError) {
    return { success: false, message: apiRes.message };
  }

  // 2. Offline Fallback: If backend server is unreachable, check cached credentials
  const cachedUsers = loadCachedUsers();
  const found = cachedUsers.find(
    (u) =>
      u.email.toLowerCase() === cleanEmail && u.password === password
  );

  if (found) {
    const { password: _pw, ...safeUser } = found;
    saveSession(safeUser, rememberMe);
    return { success: true, user: safeUser };
  }

  return {
    success: false,
    message: apiRes.message || 'Invalid email or password. Please verify your credentials.',
  };
}

/**
 * Register a new student account permanently in MySQL database.
 *
 * @param {{ name: string, email: string, password: string }} data
 * @returns {Promise<{ success: boolean, user?: object, message?: string }>}
 */
export async function registerUser({ name, email, password }) {
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  // 1. Send registration to Spring Boot MySQL backend
  const apiRes = await apiRegister(cleanName, cleanEmail, password);

  if (!apiRes.success) {
    return {
      success: false,
      message: apiRes.message || 'Registration failed. Email may already be in use.',
    };
  }

  const savedStudent = apiRes.data;
  const safeUser = {
    id: savedStudent.id,
    name: savedStudent.fullName || cleanName,
    email: savedStudent.email || cleanEmail,
    course: savedStudent.course || 'Student',
    semester: savedStudent.semester || 'Semester 1',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=6366f1&color=fff&size=250`,
    streakDays: 0,
  };

  // Cache user credentials locally for offline fallback
  cacheUser({ ...safeUser, password });

  return {
    success: true,
    user: safeUser,
    message: savedStudent.message || 'Account created successfully in MySQL database! Please log in.',
  };
}

/**
 * Save authenticated user to storage.
 * rememberMe → localStorage (survives browser close)
 * otherwise   → sessionStorage (clears on tab close)
 */
export function saveSession(user, rememberMe) {
  const payload = JSON.stringify(user);
  if (rememberMe) {
    localStorage.setItem(SESSION_REMEMBER_KEY, payload);
    sessionStorage.removeItem(SESSION_KEY);
  } else {
    sessionStorage.setItem(SESSION_KEY, payload);
    localStorage.removeItem(SESSION_REMEMBER_KEY);
  }
}

/**
 * Retrieve the current session user (or null if not logged in).
 * Checks sessionStorage first, then localStorage.
 */
export function getSession() {
  try {
    const session =
      sessionStorage.getItem(SESSION_KEY) ||
      localStorage.getItem(SESSION_REMEMBER_KEY);
    if (session) return JSON.parse(session);
  } catch {
    // ignore corrupt data
  }
  return null;
}

/** Clear both session stores — effectively logs the user out. */
export function logoutUser() {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_REMEMBER_KEY);
}

