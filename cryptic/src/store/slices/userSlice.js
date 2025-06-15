import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userApi } from "../../api/endpoints/userApi"; // Імпортуємо API

export const fetchUser = createAsyncThunk(
  "userStore/fetchUser",
  async (_,{ rejectWithValue }) => {
    try {
      const response = await userApi.getProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching user");
    }
  }
);

export const setupTwoFactor = createAsyncThunk(
  "userStore/setupTwoFactor",
  async (_,{ rejectWithValue }) => {
    try {
      const response = await userApi.setupTwoFactor();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error setup Two Factor");
    }
  }
);

export const sendCodeTwoFactor = createAsyncThunk(
    "userStore/sendCodeTwoFactor",
    async (data,{ rejectWithValue }) => {
      try {
        const response = await userApi.sendCodeTwoFactor(data);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Error send code");
      }
    }
  );

export const disableTwoFactor = createAsyncThunk(
  "userStore/disableTwoFactor",
  async (_,{ rejectWithValue }) => {
    try {
      const response = await userApi.disableTwoFactor();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error setup Two Factor");
    }
  }
);

export const sendRecoveryCode = createAsyncThunk(
    "userStore/sendRecoveryCode",
    async (data,{ rejectWithValue }) => {
      try {
        const response = await userApi.sendRecoveryCode(data);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Error send code");
      }
    }
  );

  export const resetPassword = createAsyncThunk(
    "userStore/resetPassword",
    async (data,{ rejectWithValue }) => {
      try {
        const response = await userApi.resetPassword(data);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Error resetPassword user");
      }
    }
  );

  export const updateUser = createAsyncThunk(
    "userStore/updateUser",
    async (data,{ dispatch, rejectWithValue }) => {
      try {
        const response = await userApi.updateProfile(data);
        dispatch(fetchUser());
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Error update user");
      }
    }
  );

const initialState = {
    user: null,
    isLoading: false,
    error: false,
    messageRecoveryPassword: null,
    messageConfirmTwoFactor: null,
  };
  
  const userSlice = createSlice({
    name: "userStore",
    initialState,
    reducers: {
      setUser: (state, action) => {
        state.user = action.payload;
      },
      clearUser: (state) => {
        state.user = null;
      }
    },
    extraReducers: (builder) => {
    builder
        // GET USER
        .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        })
        .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        })
        .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        })
        .addCase(sendRecoveryCode.rejected, (state, action) => {
            const serverMessage = action.payload.message || action.payload;
            if (serverMessage === "Невірний код або email.") {
              state.messageRecoveryPassword = "Невірний код";
            } else {
              state.messageRecoveryPassword = "Щось пішло не так. Спробуйте ще раз.";
            }
          })
        .addCase(resetPassword.rejected, (state, action) => {
            const serverMessage = action.payload.message || action.payload;
            if (serverMessage === "Невірний код або email.") {
              state.messageRecoveryPassword = "Невірний код";
            } else {
              state.messageRecoveryPassword = "Щось пішло не так. Спробуйте ще раз.";
            }
          })
        .addCase(sendRecoveryCode.fulfilled, (state) => {
            state.errorRecoveryPassword = null;
        })
        .addCase(resetPassword.fulfilled, (state) => {
            state.errorRecoveryPassword = null;
        })
        .addCase(sendCodeTwoFactor.rejected, (state, action) => {
            state.messageConfirmTwoFactor  = action.payload.message || action.payload;
            const serverMessage = action.payload.message || action.payload;
            if (serverMessage === "Невірний код.") {
              state.messageConfirmTwoFactor = "Невірний код";
            } else {
              state.messageConfirmTwoFactor = "Щось пішло не так. Спробуйте ще раз.";
            }
          });
    },
  });
  
  export const { setUser, clearUser } = userSlice.actions;
  export default userSlice.reducer;
  