import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://mempool.space/api/v1/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for authentication if needed
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;