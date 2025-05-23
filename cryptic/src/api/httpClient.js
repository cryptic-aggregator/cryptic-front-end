import axios from 'axios';
import { API_BASE_URL } from './config';
import store from "../store/index.js";
import { login, logout } from "../store/slices/authSlice";

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  }
});

// Додавання токена в кожен запит
httpClient.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.accessToken;

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Оновлення токена, якщо він протух
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const state = store.getState();
        const refreshToken = state.auth.refreshToken;
        console.log(refreshToken);
        if (!refreshToken) {
          store.dispatch(logout());
          window.location.href = "/signin";
          return Promise.reject(error);
        }

        // Запит на оновлення токена
        const res = await axios.post(`${API_BASE_URL}/users/refresh`, `"${refreshToken}"`);
        const newAccessToken = res.data.accessToken;

        // Оновлюємо токени в Redux
        store.dispatch(login({ accessToken: newAccessToken, refreshToken }));

        // Додаємо новий токен в заголовки повторного запиту
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        console.log("newAccessToken:", newAccessToken);
        return httpClient(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        console.log(refreshError);
       // window.location.href = "/signin";
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default httpClient;
