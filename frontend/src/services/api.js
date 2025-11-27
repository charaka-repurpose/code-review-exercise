import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  (config) => {
    // Token will be added per request as needed
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access');
    }
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (email, password, name) => {
  const response = await apiClient.post('/auth/register', { email, password, name });
  return response.data;
};

export const getUsers = async (token, search = '') => {
  const response = await apiClient.get('/users', {
    params: { search },
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getUserById = async (token, id) => {
  const response = await apiClient.get(`/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateUser = async (token, id, userData) => {
  const response = await apiClient.put(`/users/${id}`, userData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteUser = async (token, id) => {
  const response = await apiClient.delete(`/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const changePassword = async (token, userId, oldPassword, newPassword) => {
  const response = await apiClient.post(`/users/${userId}/password`, 
    { oldPassword, newPassword },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const getUserStats = async () => {
  const response = await apiClient.get('/users/stats/summary');
  return response.data;
};

