import { configureStore } from "@reduxjs/toolkit";
import authReducer, { login, logout } from "./slices/authSlice";
import portfolioReducer from "./slices/portfolioSlice";
import { createLogger } from "redux-logger";
import analyticsReducer from "./slices/analyticsSlice";
import transactionReducer from "./slices/transactionSlice";
import userReducer, { setUser, fetchUser } from "./slices/userSlice"
import walletReducer from "./slices/walletSlice";
import {jwtDecode} from "jwt-decode";
import { errorMiddleware } from "./middleware/errorMiddleware";
import { API_BASE_URL } from "../api/config";
import axios from "axios";

const store = configureStore({
  reducer: {
    auth: authReducer,
    walletStore: walletReducer,
    portfolioStore: portfolioReducer,
    analyticsStore: analyticsReducer,
    userStore: userReducer,
    transactionStore: transactionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(errorMiddleware),

});
//  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk, logger),
// Функція ініціалізації стану при завантаженні сторінки
let isInitializing = false;

export const initializeAuth = async () => {
  // Перевіряємо, чи вже йде ініціалізація
  if (isInitializing) {
    console.log("Ініціалізація вже триває, пропускаємо повторний виклик");
    return;
  }

  isInitializing = true;

  try {
    const refreshToken = sessionStorage.getItem("refreshToken");

    if (!refreshToken) {
      store.dispatch(logout());
      console.warn("Немає refreshToken у sessionStorage");
      return;
    }

    const res = await axios.post(
      `${API_BASE_URL}/users/refresh`,
      `"${refreshToken}"`,
      {
        headers: { 'Content-Type': 'application/json-patch+json' },
      }
    );

    const accessTokenNew = res.data.accessToken;
    const refreshTokenNew = res.data.refreshToken;
    console.log('Нові токени отримано:', refreshTokenNew);
    
    sessionStorage.setItem("refreshToken", refreshTokenNew);
    store.dispatch(login({ accessToken: accessTokenNew, refreshToken: refreshTokenNew }));
    
    // Очікуємо результат fetchUser
    const result = await store.dispatch(fetchUser());

    // Перевірка статусу (rejected — якщо фетч не вдався)
    if (fetchUser.rejected.match(result)) {
      throw new Error("Не вдалося отримати користувача");
    }
    
  } catch (error) {
    console.error("Помилка при ініціалізації авторизації", error);
    store.dispatch(logout());
  } finally {
    isInitializing = false;
  }
};

export default store;
