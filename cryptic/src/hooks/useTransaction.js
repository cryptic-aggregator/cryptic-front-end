import { useSelector } from "react-redux";

export function useTransaction() {
  const { listTransactionFromPortfolio, loadingListTransactionFromPortfolio, errorListTransactionFromPortfolio } = useSelector((state) => state.transactionStore);

  return {
    listTransactionFromPortfolio,
    loadingListTransactionFromPortfolio,
    errorListTransactionFromPortfolio
  };
}
