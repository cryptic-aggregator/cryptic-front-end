import { useSelector } from "react-redux";

export function useAnalyics() {
  const { analytics, loadingAnalytics, errorAnalytics } = useSelector((state) => state.analyticsStore);

  return {
    analytics,
    loadingAnalytics,
    errorAnalytics,
  };
}
