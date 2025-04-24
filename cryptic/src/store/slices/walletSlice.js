import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { walletApi } from "../../api/endpoints/walletApi"; // Імпортуємо API

export const fetchWallets = createAsyncThunk(
  "walletStore/fetchWallets",
  async (data, { rejectWithValue }) => {
    console.log(567567567)
    try {
      const response = await walletApi.getWallets(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching wallets");
    }
  }
);


export const changeVisibilityWallet = createAsyncThunk(
  "walletStore/changeVisibilityWallet",
  async (data, { dispatch, rejectWithValue }) => {
    console.log(567567567)
    try {
      await walletApi.changeVisibilityWallet(data.portfolioId, data.walletId, data.visibility);
      dispatch(fetchWallets(data.portfolioId)); // Оновлюємо список після додавання
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error changeVisibilityWallet wallets");
    }
  }
);

const initialState = {
  selectedWallet: null,
  connectWalletAddress: null,
  listWalletsFromPortfolio: null,
  loadingListWalletsFromPortfolio: false,
  errorListWalletsFromPortfolio: null,
};
  
  const walletSlice = createSlice({
    name: "walletStore",
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
      extraReducers: (builder) => {
        builder
          // GET WALLETS
          .addCase(fetchWallets.pending, (state) => {
            state.loadingListWalletsFromPortfolio = true;
            state.errorListWalletsFromPortfolio = null;
          })
          .addCase(fetchWallets.fulfilled, (state, action) => {
            state.loadingListWalletsFromPortfolio = false;
            state.listWalletsFromPortfolio = action.payload;
          })
          .addCase(fetchWallets.rejected, (state, action) => {
            state.loadingListWalletsFromPortfolio = false;
            state.errorListWalletsFromPortfolio = action.payload;
          });

      },
    });
  
  export const {  setSelectedWallet,setWalletAddress, clearWalletAddress } = walletSlice.actions;
  export default walletSlice.reducer;
