import { useSelector } from "react-redux";

export function useAnalyics() {
  const { assetAllocation, performance, tokenDistribution, walletActivity, riskScore} = useSelector((state) => state.analyticsStore);

  return {
    assetAllocation,
    performance,
    tokenDistribution,
    walletActivity,
    riskScore
  };
}
