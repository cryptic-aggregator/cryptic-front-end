import { useSelector } from "react-redux";

export function useWallet() {
  const { selectedWallet, connectWalletAddress } = useSelector((state) => state.walletStore);

  return {
    selectedWallet, 
    connectWalletAddress
  };
}

