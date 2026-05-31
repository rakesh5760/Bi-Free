import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// Create a centralized Axios instance
export const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1', // Connected to FastAPI Backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error normalization and refresh token handling (placeholder)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized errors (e.g., redirect to login or attempt refresh)
      // Do not hard-reload if already on the login page to avoid wiping out user inputs
      if (window.location.pathname !== '/login') {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Client Dashboard APIs
export interface ClientProjectParams {
  page?: number;
  size?: number;
  search?: string;
}

export const clientApi = {
  getProjects: async (params?: ClientProjectParams) => {
    const response = await api.get('/clients/me/projects', { params });
    return response.data; // Expected format: PaginatedResponse[Project]
  },
  createProject: async (data: any) => {
    const response = await api.post('/clients/me/projects', data);
    return response.data;
  },
  reviewQA: async (submissionId: number, approve: boolean) => {
    const response = await api.post(`/clients/qa-submissions/${submissionId}/review`, { approve });
    return response.data;
  },
  revokeProject: async (projectId: number, reason: string) => {
    const response = await api.post(`/clients/me/projects/${projectId}/revoke`, { reason });
    return response.data;
  }
};

export const facultyApi = {
  getLevels: async () => {
    const response = await api.get('/core/levels');
    return response.data;
  },
  getDomains: async () => {
    const response = await api.get('/core/domains');
    return response.data;
  },
  overrideStudentProfile: async (userId: number, data: { level_id: number; domain_id: number; reason?: string }) => {
    const response = await api.put(`/faculty/students/${userId}/override`, data);
    return response.data;
  }
};
