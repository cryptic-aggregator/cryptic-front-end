import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: sessionStorage.getItem('accessToken') || null,
  refreshToken: sessionStorage.getItem('refreshToken') || null,
  isAuthenticated: !!sessionStorage.getItem('accessToken'),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      sessionStorage.setItem("accessToken", action.payload.accessToken);
      sessionStorage.setItem("refreshToken", action.payload.refreshToken);
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
