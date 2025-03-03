import { useSelector } from "react-redux";

export function usePortfolio() {
  const { portfolios, portfolio, loadingPortfolios,loadingPortfolio, errorPortfolios, errorPortfolio } = useSelector((state) => state.portfolio);

  return {
    portfolios,
    portfolio,
    loadingPortfolios,
    loadingPortfolio,
    errorPortfolios,
    errorPortfolio,
  };
}

