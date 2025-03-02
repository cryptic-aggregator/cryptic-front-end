import axios from 'axios';
import { API_BASE_URL } from './config';
import { getTokenFromLocalStorage } from '../helper/localstorage';

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: 'Bearer' + getTokenFromLocalStorage() || '',
  }
});
//Інтерцептор для автоматичного додавання токена
httpClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('accessToken');
    console.log(token)
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log(config)
    return config;
  },
  (error) => Promise.reject(error)
);

//Інтерцептор для оновлення токена
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(`${API_BASE_URL}/users/refresh`, {}, { withCredentials: true });
        const newAccessToken = res.data.accessToken;
        sessionStorage.setItem('accessToken', newAccessToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        console.log(originalRequest)
        return httpClient(originalRequest);
      } catch (refreshError) {
        sessionStorage.removeItem('accessToken');
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);
export default httpClient;