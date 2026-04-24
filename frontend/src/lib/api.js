import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('wc_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('wc_token');
      localStorage.removeItem('wc_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Workers
export const workerApi = {
  search: (params) => api.get('/workers/search', { params }),
  getAll: () => api.get('/workers'),
  getProfile: (userId) => api.get(`/workers/profile/${userId}`),
  updateProfile: (data) => api.post('/workers/profile', data),
  updateAvailability: (availability) => api.patch(`/workers/availability?availability=${availability}`),
};

// Helpers
export const helperApi = {
  getProfile: (userId) => api.get(`/helpers/profile/${userId}`),
  updateProfile: (data) => api.post('/helpers/profile', data),
  updateAvailability: (availability) => api.patch(`/helpers/availability?availability=${availability}`),
};

// Bookings
export const bookingApi = {
  create: (workerId, data) => api.post(`/bookings/worker/${workerId}`, data),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getIncoming: () => api.get('/bookings/incoming'),
  updateStatus: (bookingId, status) => api.patch(`/bookings/${bookingId}/status`, { status }),
};

// Jobs
export const jobApi = {
  create: (data) => api.post('/jobs', data),
  getMyJobs: () => api.get('/jobs/my-jobs'),
  search: (params) => api.get('/jobs/search', { params }),
  getOpen: () => api.get('/jobs/open'),
  getById: (id) => api.get(`/jobs/${id}`),
  updateStatus: (id, status) => api.patch(`/jobs/${id}/status`, { status }),
  delete: (id) => api.delete(`/jobs/${id}`),
};

// Applications
export const applicationApi = {
  apply: (jobId, coverMessage) => api.post(`/applications/job/${jobId}`, { coverMessage }),
  getForJob: (jobId) => api.get(`/applications/job/${jobId}`),
  getMyApplications: () => api.get('/applications/my-applications'),
  updateStatus: (applicationId, status) => api.patch(`/applications/${applicationId}/status`, { status }),
};

// Reviews
export const reviewApi = {
  create: (revieweeId, data) => api.post(`/reviews/user/${revieweeId}`, data),
  getForUser: (userId) => api.get(`/reviews/user/${userId}`),
};

// Messages
export const messageApi = {
  send: (receiverId, content) => api.post(`/messages/send/${receiverId}`, { content }),
  getConversation: (partnerId) => api.get(`/messages/conversation/${partnerId}`),
  getPartners: () => api.get('/messages/partners'),
};

export default api;
