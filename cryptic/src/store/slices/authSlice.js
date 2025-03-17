import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: sessionStorage.getItem('accessToken') || null,
  refreshToken: sessionStorage.getItem('refreshToken') || null,
  user: JSON.parse(sessionStorage.getItem('user')) || null,
  isAuthenticated: !!sessionStorage.getItem('accessToken'),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      sessionStorage.setItem("accessToken", action.payload.accessToken);
      sessionStorage.setItem("refreshToken", action.payload.refreshToken);
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
      sessionStorage.removeItem("user");
    },
  },
});

export const { setTokens, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
