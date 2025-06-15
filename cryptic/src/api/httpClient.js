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

// ➕ Додаємо accessToken до кожного запиту
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

// 🔄 Обробка 401 + оновлення токена
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // ✅ Читаємо refreshToken з sessionStorage
        const refreshToken = sessionStorage.getItem("refreshToken");

        if (!refreshToken) {
          store.dispatch(logout());
          window.location.href = "/signin";
          return Promise.reject(error);
        }

        const res = await axios.post(
          `${API_BASE_URL}/users/refresh`,
          `"${refreshToken}"`,
          {
            headers: { 'Content-Type': 'application/json-patch+json' }
          }
        );

        const accessTokenNew = res.data.accessToken;
        const refreshTokenNew = res.data.refreshToken;
        // ✅ Оновлюємо тільки accessToken у Redux
        store.dispatch(login({ accessToken: accessTokenNew, refreshToken: refreshTokenNew }));

        // 🔁 Повторюємо оригінальний запит з новим токеном
        originalRequest.headers["Authorization"] = `Bearer ${accessTokenNew}`;
        return httpClient(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;
