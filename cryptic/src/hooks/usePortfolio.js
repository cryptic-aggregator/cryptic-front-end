import { useSelector } from "react-redux";

export function usePortfolio() {
  const { portfolios, portfolio, loadingPortfolios,loadingPortfolio, errorPortfolios, errorPortfolio , errorConnect, awaitConnect } = useSelector((state) => state.portfolioStore);

  return {
    portfolios,
    portfolio,
    loadingPortfolios,
    loadingPortfolio,
    errorPortfolios,
    errorPortfolio,
    errorConnect,
    awaitConnect
  };
}

