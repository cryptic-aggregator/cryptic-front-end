import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { analyticsApi } from "../../api/endpoints/analyticsApi"; // Імпортуємо API

// Async Thunk для отримання портфоліо
export const fetchAssetAllocation = createAsyncThunk(
  "analyticsStore/fetchAssetAllocation",
  async (data, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getAnalyticsAllocations(data); // Використовуємо API
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching Asset Allocation");
    }
  }
);
export const fetchPerformance = createAsyncThunk(
  "analyticsStore/fetchPerformance",
  async (data, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getAnalyticsAllocations(data); // Використовуємо API
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching Asset Allocation");
    }
  }
);
export const fetchRiskScore = createAsyncThunk(
  "analyticsStore/fetchRiskScore",
  async (data, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getAnalyticsAllocations(data); // Використовуємо API
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching Asset Allocation");
    }
  }
);
export const fetchTokenDistribution = createAsyncThunk(
  "analyticsStore/fetchTokenDistribution",
  async (data, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getAnalyticsAllocations(data); // Використовуємо API
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching Asset Allocation");
    }
  }
);
export const fetchWalletActivity = createAsyncThunk(
  "analyticsStore/fetchAssetAllocation",
  async (data, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.fetchWalletActivity(data); // Використовуємо API
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching Asset Allocation");
    }
  }
);
const initialState = {
  assetAllocation: {
    data: null,
    loading: false,
    error: false,
  },
  performance: {
    data: null,
    loading: false,
    error: false,
  },
  tokenDistribution: {
    data: null,
    loading: false,
    error: false,
  },
  walletActivity: {
    data: null,
    loading: false,
    error: false,
  },
  riskScore: {
    data: null,
    loading: false,
    error: false,
  },
};

const analyticsSlice = createSlice({
  name: "analyticsStore",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssetAllocation.pending, (state) => {
        state.assetAllocation.loading = true;
        state.assetAllocation.error = false;
      })
      .addCase(fetchAssetAllocation.fulfilled, (state, action) => {
        state.assetAllocation.loading = false;
        state.assetAllocation.data = action.payload.calculatedCoins;
      })
      .addCase(fetchAssetAllocation.rejected, (state, action) => {
        state.assetAllocation.loading = false;
        state.assetAllocation.error = true;
      });
  },
});

export default analyticsSlice.reducer;
