import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lifedrops_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('lifedrops_token');
      localStorage.removeItem('lifedrops_user');
    }
    return Promise.reject(err);
  }
);

export const getErrorMessage = (err) => {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.response?.data?.details?.length) {
    return err.response.data.details.map((d) => d.message).join(', ');
  }
  return err?.message || 'Something went wrong';
};
