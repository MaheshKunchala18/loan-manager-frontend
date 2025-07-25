import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';

const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

const api: AxiosInstance = axios.create(API_CONFIG);

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (import.meta.env.VITE_APP_NAME) {
      config.headers['X-App-Name'] = import.meta.env.VITE_APP_NAME;
    }
    if (import.meta.env.VITE_APP_VERSION) {
      config.headers['X-App-Version'] = import.meta.env.VITE_APP_VERSION;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          toast.error(data.message || 'Authentication failed');
          break;
        case 403:
          toast.error(data.message || 'Access denied');
          break;
        case 429:
          toast.error(data.message || 'Too many requests. Please try again later.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(data.message || 'An error occurred');
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error('An unexpected error occurred');
    }
    
    return Promise.reject(error);
  }
);

export const apiCall = {
  get: <T>(url: string, params?: any) => api.get<T>(url, { params }),
  post: <T>(url: string, data?: any) => api.post<T>(url, data),
  put: <T>(url: string, data?: any) => api.put<T>(url, data),
  delete: <T>(url: string) => api.delete<T>(url),
};

export const getApiConfig = () => ({
  baseURL: API_CONFIG.baseURL,
  environment: import.meta.env.VITE_NODE_ENV || 'development',
  appName: import.meta.env.VITE_APP_NAME || 'CreditSea',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
});

export default api; 