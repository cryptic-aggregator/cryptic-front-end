import { configureStore } from "@reduxjs/toolkit";
import authReducer, { login, logout } from "./slices/authSlice";
import portfolioReducer from "./slices/portfolioSlice";
import { createLogger } from "redux-logger";
import analyticsReducer from "./slices/analyticsSlice";
import transactionReducer from "./slices/transactionSlice";
import userReducer, { setUser, fetchUser } from "./slices/userSlice"
import walletReducer from "./slices/walletSlice";
import {jwtDecode} from "jwt-decode";

const store = configureStore({
  reducer: {
    auth: authReducer,
    walletStore: walletReducer,
    portfolioStore: portfolioReducer,
    analyticsStore: analyticsReducer,
    userStore: userReducer,
    transactionStore: transactionReducer,
  }

});
//  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk, logger),
// Функція ініціалізації стану при завантаженні сторінки
export const initializeAuth = async () => {
  const accessToken = sessionStorage.getItem("accessToken");
  const refreshToken = sessionStorage.getItem("refreshToken");

  if (!accessToken) {
    store.dispatch(logout());
    console.error("Немає accessToken");
    return;
  }

  try {

      store.dispatch(login({ accessToken, refreshToken }));
      // Очікуємо результат fetchUser
      const result = await store.dispatch(fetchUser());

      // Перевірка статусу (rejected — якщо фетч не вдався)
      if (fetchUser.rejected.match(result)) {
        throw new Error("Не вдалося отримати користувача");
      }
    
  } catch (error) {
    console.error("Помилка при ініціалізації авторизації", error);
    store.dispatch(logout());
  }
};

export default store;
