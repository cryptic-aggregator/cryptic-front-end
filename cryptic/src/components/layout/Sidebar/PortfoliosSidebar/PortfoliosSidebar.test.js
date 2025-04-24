import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import SideBarPortfolios from "./SideBarPortfolios";
import { fetchPortfolios, deletePortfolio } from "../../../../store/slices/portfolioSlice";
import { useAuth } from "../../../../hooks/useAuth";
import { usePortfolio } from "../../../../hooks/usePortfolio";
import React from 'react';
import { thunk } from "redux-thunk";
import configureMockStore from "redux-mock-store";
import "@testing-library/jest-dom";

// Correctly create the mock store with middleware
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock("../hooks/useAuth");
jest.mock("../hooks/usePortfolio");
jest.mock("../store/slices/portfolioSlice", () => ({
  fetchPortfolios: jest.fn(),
  deletePortfolio: jest.fn(),
}));
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key, // Return the key instead of translation
  }),
}));
  
describe("SideBarPortfolios", () => {
  let store;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    useAuth.mockReturnValue({ isAuth: true }); 
    
    // Create the mock store with initial state
    store = mockStore({
      auth: { isAuth: true },
      portfolioStore: {
        portfolios: [{ id: 1, name: "Test Portfolio" }],
        loadingPortfolios: false,
        errorPortfolios: null,
      },
    });

    // Ensure dispatch is mocked
    store.dispatch = jest.fn();

    fetchPortfolios.mockReturnValue({ type: "portfolioStore/fetchPortfolios/pending" });
  });

  it("Renders portfolio list when portfolios exist", () => {
    usePortfolio.mockReturnValue({
      portfolios: [{ id: 1, name: "Test Portfolio" }],
      loadingPortfolios: false,
      errorPortfolios: null,
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <SideBarPortfolios />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Test Portfolio")).toBeInTheDocument();
  });

  it("Displays message when no portfolios exist", () => {
    usePortfolio.mockReturnValue({
      portfolios: [],
      loadingPortfolios: false,
      errorPortfolios: null,
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <SideBarPortfolios />
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByText("You don't have a portfolio yet, but you can easily create one")
    ).toBeInTheDocument();
  });

  it("Handles portfolio deletion", () => {
    usePortfolio.mockReturnValue({
      portfolios: [{ id: 1, name: "Test Portfolio" }],
      loadingPortfolios: false,
      errorPortfolios: null,
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <SideBarPortfolios />
        </MemoryRouter>
      </Provider>
    );

    const deleteButton = screen.getByTitle("edit");
    fireEvent.click(deleteButton);

    // Verify that deletePortfolio was called with the correct portfolio ID
    expect(deletePortfolio).toHaveBeenCalledWith(1);
  });
});