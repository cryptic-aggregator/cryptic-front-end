import { configureStore } from "@reduxjs/toolkit";
import authReducer, { setTokens, setUser, logout } from "./slices/authSlice";
import portfolioReducer, { portfolio } from "./slices/portfolioSlice";
import httpClient from "../api/httpClient";
import {jwtDecode} from "jwt-decode";

const store = configureStore({
  reducer: {
    auth: authReducer,
    portfolio: portfolioReducer,
  },
});

// Функція ініціалізації стану при завантаженні сторінки
export const initializeAuth = async () => {
  const accessToken = sessionStorage.getItem("accessToken");
  const refreshToken = sessionStorage.getItem("refreshToken");

  if (accessToken) {
    try {
      const decodedToken = jwtDecode(accessToken);
      const currentTime = Date.now() / 1000; // Поточний час у секундах

      if (decodedToken.exp < currentTime) {
        // Якщо токен прострочений, пробуємо оновити
        if (refreshToken) {
          try {
            const res = await httpClient.post("/users/refresh", { refreshToken });
            store.dispatch(setTokens({ accessToken: res.data.accessToken, refreshToken }));
            const newDecoded = jwtDecode(res.data.accessToken);
            store.dispatch(setUser(newDecoded));
          } catch (error) {
            store.dispatch(logout());
          }
        } else {
          store.dispatch(logout());
        }
      } else {
        // Якщо токен ще валідний, просто зберігаємо користувача
        store.dispatch(setUser(decodedToken));
      }
    } catch (error) {
      console.error("Помилка при декодуванні токена:", error);
      store.dispatch(logout());
    }
  }
};

export default store;
