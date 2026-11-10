// API Client for Smart Study Planner backend (Spring Boot + MySQL)
// Handles Subjects, Topics, and Authentication with automatic student scoping

const API_BASE = 'http://localhost:8081/api';

/** Helper for JSON fetch with timeout */
async function fetchWithTimeout(url, options = {}, timeoutMs = 4000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      signal: controller.signal,
    });
    clearTimeout(timer);
    return response;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

// -----------------------------------------------------------------------------
// Authentication APIs
// -----------------------------------------------------------------------------

export async function apiLogin(email, password) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, data };
    }
    const err = await res.json().catch(() => ({}));
    return { success: false, message: err.error || 'Invalid email or password.' };
  } catch {
    return { success: false, message: 'Server unreachable. Please check backend connection.', networkError: true };
  }
}

export async function apiRegister(fullName, email, password) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/auth/register`, {
      method: 'POST',
      body: JSON.stringify({ fullName, email, password }),
    });
    if (res.ok) {
      return { success: true, data: await res.json() };
    }
    const err = await res.json().catch(() => ({}));
    return { success: false, message: err.error || 'Registration failed' };
  } catch {
    return { success: false, message: 'Server unreachable. Please check backend connection.', networkError: true };
  }
}

// -----------------------------------------------------------------------------
// Subject APIs (Scoped by Student ID)
// -----------------------------------------------------------------------------

/**
 * Fetch all subjects for a specific student from MySQL.
 * Scoped by studentId: GET /api/subjects/student/{studentId}
 */
export async function apiFetchSubjects(studentId) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/subjects/student/${studentId}`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Backend offline
  }
  return null;
}

/**
 * Create a new Subject in MySQL.
 * POST /api/subjects
 */
export async function apiCreateSubject(subjectData) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/subjects`, {
      method: 'POST',
      body: JSON.stringify(subjectData),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Backend offline
  }
  return null;
}

/**
 * Update an existing Subject in MySQL.
 * PUT /api/subjects/{id}
 */
export async function apiUpdateSubject(subjectId, subjectData) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/subjects/${subjectId}`, {
      method: 'PUT',
      body: JSON.stringify(subjectData),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Backend offline
  }
  return null;
}

/**
 * Delete a Subject from MySQL.
 * DELETE /api/subjects/{id}
 */
export async function apiDeleteSubject(subjectId) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/subjects/${subjectId}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch {
    return false;
  }
}

// -----------------------------------------------------------------------------
// Topic APIs (Scoped by Subject ID)
// -----------------------------------------------------------------------------

/**
 * Fetch all topics for a specific subject from MySQL.
 * GET /api/topics/subject/{subjectId}
 */
export async function apiFetchTopics(subjectId) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/topics/subject/${subjectId}`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Backend offline
  }
  return null;
}

/**
 * Create a new Topic under a Subject in MySQL.
 * POST /api/topics
 */
export async function apiCreateTopic(topicData) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/topics`, {
      method: 'POST',
      body: JSON.stringify(topicData),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Backend offline
  }
  return null;
}

/**
 * Update a Topic (title, difficulty, status, completion).
 * PUT /api/topics/{id}
 */
export async function apiUpdateTopic(topicId, topicData) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/topics/${topicId}`, {
      method: 'PUT',
      body: JSON.stringify(topicData),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Backend offline
  }
  return null;
}

/**
 * Toggle topic completion status in MySQL.
 * PATCH /api/topics/{id}/toggle
 */
export async function apiToggleTopic(topicId) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/topics/${topicId}/toggle`, {
      method: 'PATCH',
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Backend offline
  }
  return null;
}

/**
 * Delete a Topic from MySQL.
 * DELETE /api/topics/{id}
 */
export async function apiDeleteTopic(topicId) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/topics/${topicId}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch {
    return false;
  }
}

// -----------------------------------------------------------------------------
// Study Task APIs (Scoped by Student ID & MySQL)
// -----------------------------------------------------------------------------

/**
 * Fetch all study tasks for a student from MySQL.
 * GET /api/tasks/student/{studentId}
 */
export async function apiFetchTasks(studentId) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/tasks/student/${studentId}`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Backend offline / network issue
  }
  return null;
}

/**
 * Create a new Study Task in MySQL.
 * POST /api/tasks
 */
export async function apiCreateTask(taskData) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Backend offline
  }
  return null;
}

/**
 * Update an existing Study Task in MySQL.
 * PUT /api/tasks/{id}
 */
export async function apiUpdateTask(taskId, taskData) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Backend offline
  }
  return null;
}

/**
 * Toggle task completion status in MySQL.
 * PATCH /api/tasks/{id}/toggle
 */
export async function apiToggleTask(taskId) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/tasks/${taskId}/toggle`, {
      method: 'PATCH',
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Backend offline
  }
  return null;
}

/**
 * Delete a Study Task from MySQL.
 * DELETE /api/tasks/{id}
 */
export async function apiDeleteTask(taskId) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/tasks/${taskId}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch {
    return false;
  }
}


// -----------------------------------------------------------------------------
// Machine Learning & Data Science APIs
// -----------------------------------------------------------------------------

/**
 * Fetch AI/ML insights for a student:
 * - Performance Prediction (predicted exam score, GPA, academic risk level)
 * - Weak Subject Identification (vulnerability scoring & urgency diagnostics)
 * - Personalized Study Recommendations (actionable steps)
 * - Study Progress & Momentum Analysis
 * GET /api/ml/student/{studentId}/insights
 */
export async function apiFetchMlInsights(studentId) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/ml/student/${studentId}/insights`, {}, 5000);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Backend offline / network issue
  }
  return null;
}

/**
 * Run real-time what-if simulation on student performance:
 * Adjusts study hours, topic completion, streaks, and returns live predicted scores and GPA.
 * POST /api/ml/simulate
 */
export async function apiSimulatePerformance(simulationData) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/ml/simulate`, {
      method: 'POST',
      body: JSON.stringify(simulationData),
    }, 4000);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Backend offline
  }
  return null;
}


