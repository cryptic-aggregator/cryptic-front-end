import { login, logout } from "../slices/authSlice";
import { fetchUser, clearUser } from "../slices/userSlice";
import { authApi } from "../../api/endpoints/authApi"; // Імпортуємо API
import { createAsyncThunk } from '@reduxjs/toolkit';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, thunkAPI) => {
    try {
      const { accessToken, refreshToken } = await authApi.login(credentials);

      thunkAPI.dispatch(login({ accessToken, refreshToken }));
      thunkAPI.dispatch(fetchUser());

      return { accessToken, refreshToken };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Login failed');
    }
  }
);
  
export const logoutUser = () => (dispatch) => {
    dispatch(logout());               // authSlice
    dispatch(clearUser());            // userSlice
  };
  