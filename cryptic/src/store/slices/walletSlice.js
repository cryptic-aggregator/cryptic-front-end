import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    selectedWallet: null,
    connectWalletAddress: null,
  };
  
  const walletSlice = createSlice({
    name: "portfolioStore",
    initialState,
    reducers: {
        setSelectedWallet: (state, action) => {
          state.selectedWallet = action.payload;
        },
        setWalletAddress: (state, action) => {
          state.connectWalletAddress = action.payload;
        },
        clearWalletAddress: (state) => {
          state.connectWalletAddress = null;
        },
    },
  });
  
  export const {  setWalletAddress, clearWalletAddress, setSelectedWallet } = walletSlice.actions;
  export default walletSlice.reducer;
  