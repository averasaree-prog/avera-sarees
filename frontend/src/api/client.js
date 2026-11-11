import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Initialize session token for guest users if not present
let guestSessionToken = localStorage.getItem('saanvi_session_token');
if (!guestSessionToken) {
  guestSessionToken = 'guest_' + Math.random().toString(36).substring(2, 15) + Date.now();
  localStorage.setItem('saanvi_session_token', guestSessionToken);
}

// Request interceptor to attach JWT token and guest session token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('saanvi_jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['X-Session-Token'] = guestSessionToken;
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor to format error messages
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default api;
