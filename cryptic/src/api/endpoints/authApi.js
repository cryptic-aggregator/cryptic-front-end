import httpClient from "../httpClient";
import store from "../../store/index.js";
import { setTokens, setUser, logout } from "../../store/slices/authSlice";
import {jwtDecode} from "jwt-decode";

export const authApi = {
  register: async (userData) => {
    const response = await httpClient.post("/users/register", userData);
    return response;
  },

  login: async (credentials) => {
    const response = await httpClient.post("/users/login", credentials);
    const { accessToken, refreshToken } = response.data;

    // Зберігаємо токени в Redux
    store.dispatch(setTokens({ accessToken, refreshToken }));

    // Декодуємо токен, щоб отримати дані користувача
    const decodedUser = jwtDecode(accessToken);
    store.dispatch(setUser(decodedUser));

    return response;
  },

  logout: () => {
    store.dispatch(logout());
  },
};
