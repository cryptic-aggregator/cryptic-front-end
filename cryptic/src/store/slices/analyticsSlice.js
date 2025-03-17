import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { analyticsApi } from "../../api/endpoints/analyticsApi"; // Імпортуємо API

// Async Thunk для отримання портфоліо
export const getAnalytics = createAsyncThunk(
  "analyticsStore/getAnalytics",
  async (data, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getAnalyticsAllocations(data); // Використовуємо API
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching portfolios");
    }
  }
);

const initialState = {
  analytics: null, 
  loadingAnalytics: false, 
  errorAnalytics: null, 

};

const analyticsSlice = createSlice({
  name: "analyticsStore",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getAnalytics.pending, (state) => {
        state.loadingAnalytics = true;
        state.errorAnalytics = null;
      })
      .addCase(getAnalytics.fulfilled, (state, action) => {
        state.loadingAnalytics = false;
        state.analytics = action.payload;
      })
      .addCase(getAnalytics.rejected, (state, action) => {
        state.loadingAnalytics = false;
        state.errorAnalytics = action.payload;
      })
  },
});

export default analyticsSlice.reducer;
