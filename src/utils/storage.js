// Storage helper to persist student data in localStorage with sampleData fallback
export function loadFromStorage(key, defaultValue) {
  try {
    const saved = localStorage.getItem(`smart_study_${key}`);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.warn(`Could not load ${key} from storage:`, error);
  }
  return defaultValue;
}

export function saveToStorage(key, value) {
  try {
    localStorage.setItem(`smart_study_${key}`, JSON.stringify(value));
  } catch (error) {
    console.warn(`Could not save ${key} to storage:`, error);
  }
}

export function clearStorage() {
  try {
    const keys = ['tasks', 'subjects', 'revisionItems', 'profile'];
    keys.forEach((k) => localStorage.removeItem(`smart_study_${k}`));
  } catch (error) {
    console.warn('Could not clear storage:', error);
  }
}

