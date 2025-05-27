import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3004',
  withCredentials: true, // Só se backend usar cookies/session
});

export default api;
