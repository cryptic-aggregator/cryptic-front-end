import { useSelector } from "react-redux";

export function useAnalyics() {
  const { assetAllocation, balanceChanges, totalProfitLoss, costAnalysis, risksAndVolatility } = useSelector((state) => state.analyticsStore);

  return {
    assetAllocation,
    balanceChanges,
    totalProfitLoss,
    costAnalysis,
    risksAndVolatility
  };
}

export function useAnalyticsSection(sectionId) {
  return useSelector((state) => state.analyticsStore[sectionId]);
}