import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({ baseURL: API_BASE });

export const getMacro = () => api.get('/api/macro').then(r => r.data);
export const getScanner = () => api.get('/api/scanner').then(r => r.data);
export const getStock = (symbol) => api.get(`/api/stock/${symbol}`).then(r => r.data);
export const getPortfolio = () => api.get('/api/portfolio').then(r => r.data);
export const getBriefing = () => api.get('/api/briefing').then(r => r.data);
