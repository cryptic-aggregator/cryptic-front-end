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
  async ({id, data}, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getRisksAndVolatility(id, data); // Використовуємо API
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
  balanceChanges: {
    data: null,
    loading: false,
    error: false,
  },
  totalProfitLoss: {
    data: null,
    loading: false,
    error: false,
  },
  costAnalysis: {
    data: null,
    loading: false,
    error: false,
  },
  risksAndVolatility: {
    data: null,
    loading: false,
    error: false,
  },
};

const analyticsSlice = createSlice({
  name: "analyticsStore",
  initialState,
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
      })

      .addCase(fetchRiskScore.pending, (state) => {
        state.risksAndVolatility.loading = true;
        state.risksAndVolatility.error = false;
      })
      .addCase(fetchRiskScore.fulfilled, (state, action) => {
        state.risksAndVolatility.loading = false;
        state.risksAndVolatility.data = action.payload.points;
      })
      .addCase(fetchRiskScore.rejected, (state, action) => {
        state.risksAndVolatility.loading = false;
        state.risksAndVolatility.error = true;
      });
  },
});

export default analyticsSlice.reducer;
