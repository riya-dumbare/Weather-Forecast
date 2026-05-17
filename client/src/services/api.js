import axios from 'axios';

// Base axios instance pointing to our backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);

// Weather
export const getCurrentWeather = (city) => api.get(`/weather/current?city=${city}`);
export const getForecast = (city) => api.get(`/weather/forecast?city=${city}`);

// Locations
export const getLocations = () => api.get('/locations');
export const saveLocation = (data) => api.post('/locations', data);
export const deleteLocation = (id) => api.delete(`/locations/${id}`);

// Alerts
export const getAlerts = () => api.get('/alerts');
export const createAlert = (data) => api.post('/alerts', data);
export const deleteAlert = (id) => api.delete(`/alerts/${id}`);
// City suggestions
export const getCitySuggestions = (q) => api.get(`/weather/suggestions?q=${q}`);
export default api;
