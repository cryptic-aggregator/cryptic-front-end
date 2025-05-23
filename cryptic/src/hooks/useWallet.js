import { useSelector } from "react-redux";

export function useWallet() {
  const { selectedWallet, connectWalletReown,listWalletsFromPortfolio,loadingListWalletsFromPortfolio, errorListWalletsFromPortfolio  } = useSelector((state) => state.walletStore);

  return {
    selectedWallet, 
    connectWalletReown,
    listWalletsFromPortfolio,
    loadingListWalletsFromPortfolio,
    errorListWalletsFromPortfolio
  };
}
