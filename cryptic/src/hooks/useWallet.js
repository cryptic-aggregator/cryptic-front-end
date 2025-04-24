import { useSelector } from "react-redux";

export function useWallet() {
  const { selectedWallet, connectWalletAddress,listWalletsFromPortfolio,loadingListWalletsFromPortfolio, errorListWalletsFromPortfolio  } = useSelector((state) => state.walletStore);

  return {
    selectedWallet, 
    connectWalletAddress,
    listWalletsFromPortfolio,
    loadingListWalletsFromPortfolio,
    errorListWalletsFromPortfolio
  };
}
