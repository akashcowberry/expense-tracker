// axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

// Add a request interceptor to include the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    console.log('Axios request interceptor - Token:', token ? 'Present' : 'Missing');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set:', config.headers.Authorization);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error('Response interceptor error:', error.response?.status, error.config.url);
    
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('Attempting token refresh...');
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh');
        if (refreshToken) {
          const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
            refresh: refreshToken
          });
          
          const newToken = response.data.access;
          localStorage.setItem('access', newToken);
          
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;