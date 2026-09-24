import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT token to outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skillswap_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle unauthenticated responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid, optionally clear token
      // Avoid redirecting if already on public pages
      const currentPath = window.location.pathname;
      if (
        currentPath !== '/login' &&
        currentPath !== '/register' &&
        currentPath !== '/' &&
        currentPath !== '/about'
      ) {
        localStorage.removeItem('skillswap_token');
        localStorage.removeItem('skillswap_user');
        window.location.href = '/login?session=expired';
      }
    }
    return Promise.reject(error);
  }
);

// API Service Helpers
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updatePassword: (passwords) => api.put('/auth/updatepassword', passwords),
};

export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  getUserById: (id) => api.get(`/users/${id}`),
  getAllUsers: (params) => api.get('/users', { params }),
};

export const skillService = {
  getMySkills: () => api.get('/skills'),
  addSkillTeach: (skill) => api.post('/skills/teach', skill),
  removeSkillTeach: (name) => api.delete(`/skills/teach/${encodeURIComponent(name)}`),
  addSkillLearn: (skill) => api.post('/skills/learn', skill),
  removeSkillLearn: (name) => api.delete(`/skills/learn/${encodeURIComponent(name)}`),
  updateAllSkills: (data) => api.put('/skills', data),
};

export const matchService = {
  getMatches: () => api.get('/matches'),
};

export const connectionService = {
  sendRequest: (receiverId, note) => api.post('/connections/request', { receiverId, note }),
  getRequests: () => api.get('/connections/requests'),
  getConnections: () => api.get('/connections'),
  acceptRequest: (connectionId) => api.put(`/connections/${connectionId}/accept`),
  rejectRequest: (connectionId) => api.put(`/connections/${connectionId}/reject`),
};

export const messageService = {
  getConversations: () => api.get('/messages/conversations'),
  getMessagesWithUser: (userId) => api.get(`/messages/${userId}`),
  sendMessage: (receiverId, message) => api.post('/messages', { receiverId, message }),
};

export const sessionService = {
  createSession: (sessionData) => api.post('/sessions', sessionData),
  getMySessions: () => api.get('/sessions'),
  acceptSession: (id) => api.put(`/sessions/${id}/accept`),
  cancelSession: (id) => api.put(`/sessions/${id}/cancel`),
  completeSession: (id) => api.put(`/sessions/${id}/complete`),
};

export const reviewService = {
  createReview: (reviewData) => api.post('/reviews', reviewData),
  getUserReviews: (userId) => api.get(`/reviews/user/${userId}`),
};

export default api;
