const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get stored token
const getToken = () => localStorage.getItem('portfolio_token');

// Set token
export const setToken = (token) => localStorage.setItem('portfolio_token', token);

// Remove token
export const removeToken = () => localStorage.removeItem('portfolio_token');

// Check if logged in
export const isLoggedIn = () => !!getToken();

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }
  
  return response.json();
};

// ==================== PUBLIC API ====================

export const fetchAllData = () => apiRequest('/data');

export const fetchProfile = () => apiRequest('/profile');

export const fetchLatestProject = () => apiRequest('/latest-project');

export const fetchProjects = () => apiRequest('/projects');

// ==================== AUTH API ====================

export const login = async (username, password) => {
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  if (response.token) {
    setToken(response.token);
  }
  return response;
};

export const logout = () => {
  removeToken();
};

export const verifyToken = () => apiRequest('/auth/verify');

export const changePassword = (currentPassword, newPassword) =>
  apiRequest('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  });

// ==================== PROTECTED API ====================

export const updateProfile = (profile) =>
  apiRequest('/profile', {
    method: 'PUT',
    body: JSON.stringify(profile),
  });

export const updateLatestProject = (project) =>
  apiRequest('/latest-project', {
    method: 'PUT',
    body: JSON.stringify(project),
  });

export const updateProjects = (projects) =>
  apiRequest('/projects', {
    method: 'PUT',
    body: JSON.stringify(projects),
  });

export const addProject = (project) =>
  apiRequest('/projects', {
    method: 'POST',
    body: JSON.stringify(project),
  });

export const updateProject = (id, project) =>
  apiRequest(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(project),
  });

export const deleteProject = (id) =>
  apiRequest(`/projects/${id}`, {
    method: 'DELETE',
  });

// Upload headline image
export const uploadHeadlineImage = async (file) => {
  const token = localStorage.getItem('portfolio_token');
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_URL}/upload/headline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  // Get response text first to handle non-JSON responses
  const text = await response.text();
  
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Server error: Invalid response');
  }

  if (!response.ok) {
    throw new Error(data.error || 'Upload failed');
  }

  return data;
};
