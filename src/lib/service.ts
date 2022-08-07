import axios from 'axios';

export const service = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
});

service.interceptors.response.use((response) => response.data);
