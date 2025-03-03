import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { portfolioApi } from "../../api/endpoints/portfolioApi"; // Імпортуємо API

// Async Thunk для отримання портфоліо
export const fetchPortfolios = createAsyncThunk(
  "portfolio/fetchPortfolios",
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
  "portfolio/addPortfolio",
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
  "portfolio/deletePortfolio",
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
  "portfolio/infoPortfolio",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      await portfolioApi.infoPortfolio(data); // Надсилаємо POST-запит
      dispatch(fetchPortfolios()); // Оновлюємо список після видалення
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error get info portfolio");
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
};


const portfolioSlice = createSlice({
  name: "portfolio",
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
