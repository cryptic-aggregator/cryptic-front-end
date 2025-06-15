import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  accessToken: null,
  refreshToken: sessionStorage.getItem('refreshToken') || null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;

      // Зберігаємо тільки refreshToken
      sessionStorage.setItem("refreshToken", action.payload.refreshToken);
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      sessionStorage.removeItem("refreshToken");
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    }
  },
});

export const { login, logout, setAccessToken } = authSlice.actions;
export default authSlice.reducer;