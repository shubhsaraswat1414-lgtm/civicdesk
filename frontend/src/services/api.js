import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
});

// Attach JWT token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cms_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally — redirect to login
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cms_token');
      localStorage.removeItem('cms_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ──────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
};

// ─── Complaints ────────────────────────────────────────────────────
export const complaintsAPI = {
  // Citizen: get own complaints
  getMyComplaints: (params) => API.get('/complaints/my', { params }),

  // Moderator: get all complaints
  getAllComplaints: (params) => API.get('/complaints', { params }),

  // Create complaint
  createComplaint: (data) => API.post('/complaints', data),

  // Get single complaint
  getComplaintById: (id) => API.get(`/complaints/${id}`),

  // Moderator: update status
  updateStatus: (id, data) => API.patch(`/complaints/${id}/status`, data),

  // Delete complaint
  deleteComplaint: (id) => API.delete(`/complaints/${id}`),

  // Moderator stats
  getStats: () => API.get('/complaints/stats'),
};

export default API;
