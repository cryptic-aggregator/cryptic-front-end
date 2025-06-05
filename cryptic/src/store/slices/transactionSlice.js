import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { transactionApi } from "../../api/endpoints/transactionApi"; // Імпортуємо API

export const fetchTransaction = createAsyncThunk(
  "transactionStore/fetchTransaction",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await transactionApi.getTransactions(id ,data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching transaction");
    }
  }
);

const initialState = {
  listTransactionFromPortfolio: null,
  loadingListTransactionFromPortfolio: false,
  errorListTransactionFromPortfolio: null,
};
  
  const transactionSlice = createSlice({
    name: "transactionStore",
    initialState,
    extraReducers: (builder) => {
        builder
          .addCase(fetchTransaction.pending, (state) => {
            state.loadingListTransactionFromPortfolio = true;
            state.errorListTransactionFromPortfolio = null;
          })
          .addCase(fetchTransaction.fulfilled, (state, action) => {
            state.loadingListTransactionFromPortfolio = false;
            state.listTransactionFromPortfolio = action.payload;
          })
          .addCase(fetchTransaction.rejected, (state, action) => {
            state.loadingListTransactionFromPortfolio = false;
            state.errorListTransactionFromPortfolio = action.payload;
          });

      },
    });
  
  export default transactionSlice.reducer;
