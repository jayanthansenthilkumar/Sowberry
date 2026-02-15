const API_BASE = 'http://localhost:5000/api';

// ──────────────── TOKEN MANAGEMENT ────────────────
export const getToken = () => localStorage.getItem('sowberry_token');
export const setToken = (token) => localStorage.setItem('sowberry_token', token);
export const removeToken = () => localStorage.removeItem('sowberry_token');

export const getUser = () => {
  try {
    const user = localStorage.getItem('sowberry_user');
    return user ? JSON.parse(user) : null;
  } catch {
    localStorage.removeItem('sowberry_user');
    return null;
  }
};
export const setUser = (user) => localStorage.setItem('sowberry_user', JSON.stringify(user));
export const removeUser = () => localStorage.removeItem('sowberry_user');

export const logout = () => {
  removeToken();
  removeUser();
  window.location.href = '/auth';
};

export const isAuthenticated = () => !!getToken();

// ──────────────── API HELPER ────────────────
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const json = await response.json();

    if (response.status === 401) {
      logout();
      return json;
    }

    // Unwrap the `data` wrapper: spread data properties to top-level
    // so frontend can read e.g. res.students, res.stats directly
    if (json.success && json.data !== undefined) {
      // If data is an object (not array), spread its keys to top level
      if (json.data && typeof json.data === 'object' && !Array.isArray(json.data)) {
        return { success: true, message: json.message, ...json.data };
      }
      // If data is an array or primitive, keep as-is but also add as 'data'
      return { success: true, message: json.message, data: json.data };
    }

    return json;
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, message: 'Network error. Please check your connection.' };
  }
};

// ──────────────── AUTH API ────────────────
export const authApi = {
  login: (body) => apiCall('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body) => apiCall('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  forgotPassword: (body) => apiCall('/auth/forgot-password', { method: 'POST', body: JSON.stringify(body) }),
  verifyOtp: (body) => apiCall('/auth/verify-otp', { method: 'POST', body: JSON.stringify(body) }),
  resetPassword: (body) => apiCall('/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => apiCall('/auth/me'),
  updateProfile: (body) => apiCall('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),
  changePassword: (body) => apiCall('/auth/change-password', { method: 'PUT', body: JSON.stringify(body) }),
};

// ──────────────── ADMIN API ────────────────
export const adminApi = {
  getDashboard: () => apiCall('/admin/dashboard'),
  // Students
  getStudents: (params = '') => apiCall(`/admin/students${params ? '?' + params : ''}`),
  getStudent: (id) => apiCall(`/admin/students/${id}`),
  createStudent: (body) => apiCall('/admin/students', { method: 'POST', body: JSON.stringify(body) }),
  updateStudent: (id, body) => apiCall(`/admin/students/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteStudent: (id) => apiCall(`/admin/students/${id}`, { method: 'DELETE' }),
  // Mentors
  getMentors: (params = '') => apiCall(`/admin/mentors${params ? '?' + params : ''}`),
  getMentor: (id) => apiCall(`/admin/mentors/${id}`),
  createMentor: (body) => apiCall('/admin/mentors', { method: 'POST', body: JSON.stringify(body) }),
  updateMentor: (id, body) => apiCall(`/admin/mentors/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteMentor: (id) => apiCall(`/admin/mentors/${id}`, { method: 'DELETE' }),
  // Courses
  getCourses: () => apiCall('/admin/courses'),
  // Analytics
  getAnalytics: () => apiCall('/admin/analytics'),
  // Reports
  getReports: () => apiCall('/admin/reports'),
  // Settings
  getSettings: () => apiCall('/admin/settings'),
  updateSettings: (body) => apiCall('/admin/settings', { method: 'PUT', body: JSON.stringify(body) }),
  // Notifications
  getNotifications: () => apiCall('/admin/notifications'),
  markAllRead: () => apiCall('/admin/notifications/read-all', { method: 'PUT' }),
  // Contact Messages
  getContactMessages: () => apiCall('/admin/contact-messages'),
  markMessageRead: (id) => apiCall(`/admin/contact-messages/${id}/read`, { method: 'PUT' }),
};

// ──────────────── MENTOR API ────────────────
export const mentorApi = {
  getDashboard: () => apiCall('/mentor/dashboard'),
  // Courses
  getCourses: () => apiCall('/mentor/courses'),
  createCourse: (body) => apiCall('/mentor/courses', { method: 'POST', body: JSON.stringify(body) }),
  updateCourse: (id, body) => apiCall(`/mentor/courses/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCourse: (id) => apiCall(`/mentor/courses/${id}`, { method: 'DELETE' }),
  // Assignments
  getAssignments: () => apiCall('/mentor/assignments'),
  createAssignment: (body) => apiCall('/mentor/assignments', { method: 'POST', body: JSON.stringify(body) }),
  updateAssignment: (id, body) => apiCall(`/mentor/assignments/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteAssignment: (id) => apiCall(`/mentor/assignments/${id}`, { method: 'DELETE' }),
  getSubmissions: (assignmentId) => apiCall(`/mentor/assignments/${assignmentId}/submissions`),
  gradeSubmission: (id, body) => apiCall(`/mentor/submissions/${id}/grade`, { method: 'PUT', body: JSON.stringify(body) }),
  // Students Progress
  getStudentsProgress: () => apiCall('/mentor/students-progress'),
  // Problems
  getProblems: () => apiCall('/mentor/problems'),
  createProblem: (body) => apiCall('/mentor/problems', { method: 'POST', body: JSON.stringify(body) }),
  updateProblem: (id, body) => apiCall(`/mentor/problems/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteProblem: (id) => apiCall(`/mentor/problems/${id}`, { method: 'DELETE' }),
  // Aptitude Tests
  getAptitudeTests: () => apiCall('/mentor/aptitude-tests'),
  createAptitudeTest: (body) => apiCall('/mentor/aptitude-tests', { method: 'POST', body: JSON.stringify(body) }),
  getAptitudeTest: (id) => apiCall(`/mentor/aptitude-tests/${id}`),
  deleteAptitudeTest: (id) => apiCall(`/mentor/aptitude-tests/${id}`, { method: 'DELETE' }),
  // Events
  getEvents: () => apiCall('/mentor/events'),
  createEvent: (body) => apiCall('/mentor/events', { method: 'POST', body: JSON.stringify(body) }),
  updateEvent: (id, body) => apiCall(`/mentor/events/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteEvent: (id) => apiCall(`/mentor/events/${id}`, { method: 'DELETE' }),
  // Discussions
  getDiscussions: () => apiCall('/mentor/discussions'),
  createDiscussion: (body) => apiCall('/mentor/discussions', { method: 'POST', body: JSON.stringify(body) }),
  getDiscussion: (id) => apiCall(`/mentor/discussions/${id}`),
  replyDiscussion: (id, body) => apiCall(`/mentor/discussions/${id}/reply`, { method: 'POST', body: JSON.stringify(body) }),
  // Study Materials
  getStudyMaterials: () => apiCall('/mentor/study-materials'),
  createStudyMaterial: (body) => apiCall('/mentor/study-materials', { method: 'POST', body: JSON.stringify(body) }),
  deleteStudyMaterial: (id) => apiCall(`/mentor/study-materials/${id}`, { method: 'DELETE' }),
};

// ──────────────── STUDENT API ────────────────
export const studentApi = {
  getDashboard: () => apiCall('/student/dashboard'),
  // Courses
  getCourses: () => apiCall('/student/courses'),
  browseCourses: (params = '') => apiCall(`/student/courses/browse${params ? '?' + params : ''}`),
  enrollCourse: (id) => apiCall(`/student/courses/${id}/enroll`, { method: 'POST' }),
  getCourseMaterials: (id) => apiCall(`/student/courses/${id}/materials`),
  // Assignments
  getAssignments: () => apiCall('/student/assignments'),
  submitAssignment: (id, body) => apiCall(`/student/assignments/${id}/submit`, { method: 'POST', body: JSON.stringify(body) }),
  // Grades
  getGrades: () => apiCall('/student/grades'),
  // Progress
  getProgress: () => apiCall('/student/progress'),
  // Coding
  getCodingProblems: (params = '') => apiCall(`/student/coding-problems${params ? '?' + params : ''}`),
  getCodingProblem: (id) => apiCall(`/student/coding-problems/${id}`),
  submitCode: (id, body) => apiCall(`/student/coding-problems/${id}/submit`, { method: 'POST', body: JSON.stringify(body) }),
  // Aptitude
  getAptitudeTests: () => apiCall('/student/aptitude-tests'),
  startAptitudeTest: (id) => apiCall(`/student/aptitude-tests/${id}/start`, { method: 'POST' }),
  submitAptitudeTest: (attemptId, body) => apiCall(`/student/aptitude-tests/${attemptId}/submit`, { method: 'POST', body: JSON.stringify(body) }),
  // Study Materials
  getStudyMaterials: (params = '') => apiCall(`/student/study-materials${params ? '?' + params : ''}`),
  // Events
  getEvents: () => apiCall('/student/events'),
  registerEvent: (id) => apiCall(`/student/events/${id}/register`, { method: 'POST' }),
  // Discussions
  getDiscussions: () => apiCall('/student/discussions'),
  replyDiscussion: (id, body) => apiCall(`/student/discussions/${id}/reply`, { method: 'POST', body: JSON.stringify(body) }),
  // Notifications
  getNotifications: () => apiCall('/student/notifications'),
};

// ──────────────── PUBLIC API ────────────────
export const publicApi = {
  getCourses: () => apiCall('/public/courses'),
  submitContact: (body) => apiCall('/public/contact', { method: 'POST', body: JSON.stringify(body) }),
  subscribeNewsletter: (body) => apiCall('/public/newsletter', { method: 'POST', body: JSON.stringify(body) }),
};
