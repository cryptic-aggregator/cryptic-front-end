import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { portfolioApi } from "../../api/endpoints/portfolioApi"; // Імпортуємо API
import { fetchWallets } from "./walletSlice";
// Async Thunk для отримання портфоліо
export const fetchPortfolios = createAsyncThunk(
  "portfolioStore/fetchPortfolios",
  async (_, { rejectWithValue }) => {
    try {
      const response = await portfolioApi.getPortfolios(); // Використовуємо API
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching portfolios");
    }
  }
);
// Запит для додавання нового портфоліо
export const addPortfolio = createAsyncThunk(
  "portfolioStore/addPortfolio",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      await portfolioApi.addPortfolio(data); // Надсилаємо POST-запит
      dispatch(fetchPortfolios()); // Оновлюємо список після додавання
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error adding portfolio");
    }
  }
);

// Запит для видалення портфоліо
export const deletePortfolio = createAsyncThunk(
  "portfolioStore/deletePortfolio",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      await portfolioApi.deletePortfolio(data); // Надсилаємо POST-запит
      dispatch(fetchPortfolios()); // Оновлюємо список після видалення
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error deleting portfolio");
    }
  }
);

// Запит для отримання інформації про портфоліо
export const infoPortfolio = createAsyncThunk(
  "portfolioStore/infoPortfolio",
  async (data, { rejectWithValue }) => {
    try {
      const response = await portfolioApi.infoPortfolio(data); // Отримуємо відповідь
      return response.data; // Повертаємо дані
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error get info portfolio");
    }
  }
);
// Запит для підключення гаманця до портфоліо
export const connectWalletToPortfolio = createAsyncThunk(
  "portfolioStore/connectWalletToPortfolio",
  async ({ id, data }, { dispatch, rejectWithValue }) => {

    try {
      await portfolioApi.connectWalletToPortfolio(id, data); // Надсилаємо POST-запит
      console.log(id);
      dispatch(fetchWallets({
        portfolioId:id,
        search: null,
        networks:null,
      })); // Оновлюємо список після додавання
    } catch (error) {
      console.log("Помилка підключення гаманця до портфоліо:", error);
      return rejectWithValue(error.response?.data || "Error connect Wallet To Portfolio");
    }
  }
);

// Запит для додавання нового гаманця з створенням нового портфоліо
export const addPortfolioAndConnectWallet = createAsyncThunk(
  "portfolioStore/addPortfolioAndConnectWallet",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await portfolioApi.addPortfolio(data.namePortfolio); // Надсилаємо POST-запит

      // Викликаємо connectWalletToPortfolio через dispatch
      await dispatch(connectWalletToPortfolio({ id: response.data.id, data: data.wallets })).unwrap();
      dispatch(fetchPortfolios()); // Оновлюємо список після додавання
    } catch (error) {
      console.log("Помилка додавання портфоліо:", error);
      return rejectWithValue(error.response?.data || "Error add Portfolio And Connect Wallet");
    }
  }
);

const initialState = {
  portfolios: null, // Список портфоліо
  portfolio: null, // Окреме портфоліо
  loadingPortfolios: false, // Завантаження списку портфоліо
  loadingPortfolio: false, // Завантаження окремого портфоліо
  errorPortfolios: null, // Помилки при отриманні списку портфоліо
  errorPortfolio: null, // Помилки при отриманні окремого портфоліо
  errorConnect: null, // Помилки при отриманні окремого портфоліо
  awaitConnect: false, // Помилки при отриманні окремого портфоліо
};


const portfolioSlice = createSlice({
  name: "portfolioStore",
  initialState,
  reducers: {
    setPortfolios: (state, action) => {
      state.portfolios = action.payload;
    },
    setPortfolio: (state, action) => {
      state.portfolio = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH PORTFOLIOS
      .addCase(fetchPortfolios.pending, (state) => {
        state.loadingPortfolios = true;
        state.errorPortfolios = null;
      })
      .addCase(fetchPortfolios.fulfilled, (state, action) => {
        state.loadingPortfolios = false;
        state.portfolios = action.payload;
      })
      .addCase(fetchPortfolios.rejected, (state, action) => {
        state.loadingPortfolios = false;
        state.errorPortfolios = action.payload;
      })

      // ADD PORTFOLIO
      .addCase(addPortfolio.pending, (state) => {
        state.loadingPortfolios = true;
      })
      .addCase(addPortfolio.fulfilled, (state) => {
        state.loadingPortfolios = false;
      })
      .addCase(addPortfolio.rejected, (state, action) => {
        state.loadingPortfolios = false;
        state.errorPortfolios = action.payload;
      })

      // DELETE PORTFOLIO
      .addCase(deletePortfolio.pending, (state) => {
        state.loadingPortfolios = true;
      })
      .addCase(deletePortfolio.fulfilled, (state) => {
        state.loadingPortfolios = false;
      })
      .addCase(deletePortfolio.rejected, (state, action) => {
        state.loadingPortfolios = false;
        state.errorPortfolios = action.payload;
      })
      // CONNECT WALLET TO PORTFOLIO
      .addCase(connectWalletToPortfolio.rejected, (state, action) => {
        state.errorConnect = action.payload;
        state.awaitConnect = false;
      })
      .addCase(connectWalletToPortfolio.pending, (state) => {
        state.awaitConnect = true;
      })
      .addCase(connectWalletToPortfolio.fulfilled, (state) => {
        state.awaitConnect = false;
      })
      .addCase(addPortfolioAndConnectWallet.rejected, (state, action) => {
        state.errorConnect = action.payload;
        state.awaitConnect = false;
      })
      .addCase(addPortfolioAndConnectWallet.pending, (state) => {
        state.awaitConnect = true;
      })
      .addCase(addPortfolioAndConnectWallet.fulfilled, (state) => {
        state.awaitConnect = false;
      })
      // INFO PORTFOLIO
      .addCase(infoPortfolio.pending, (state) => {
        state.loadingPortfolio = true;
        state.errorPortfolio = null;
      })
      .addCase(infoPortfolio.fulfilled, (state, action) => {
        state.loadingPortfolio = false;
        state.portfolio = action.payload;
      })
      .addCase(infoPortfolio.rejected, (state, action) => {
        state.loadingPortfolio = false;
        state.errorPortfolio = action.payload;
      });
      
  },
});


export const { setPortfolios, setPortfolio  } = portfolioSlice.actions;
export default portfolioSlice.reducer;
