import { useEffect, useRef } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from "react-redux";
import { connectWalletToPortfolio } from "../store/slices/portfolioSlice";
import { fetchWallets } from "../store/slices/walletSlice";
export const useConnectWalletReown = ({
  connectWalletReown,
  listWalletsFromPortfolio,
  portfolioId,
  isManualInput,
  onSuccess,
  connector,
  closeAppKit,
}) => {
  const dispatch = useDispatch();
  const handledKeyRef = useRef("");

  useEffect(() => {
    const sync = async () => {
      if (!connectWalletReown || !connectWalletReown.address) return;

      const key = `${portfolioId}_${connectWalletReown.address}`;
      if (handledKeyRef.current === key) return;

      const alreadyConnected = listWalletsFromPortfolio.some(
        (wallet) => wallet.wallet_address === connectWalletReown.address
      );

      if (alreadyConnected) {
        toast.error("Цей гаманець уже приєднаний до поточного портфоліо.");
        handledKeyRef.current = key;
        return;
      }

      handledKeyRef.current = key;

      let updatedWallet = { ...connectWalletReown };
      if (!updatedWallet.walletInfoName) {
        updatedWallet.walletInfoName =
          connector?.name || updatedWallet.providerName || "Wallet";
      }
      if (!updatedWallet.walletInfoRdns) {
        updatedWallet.walletInfoRdns = connector?.id || "unknown";
      }

      try {
        await dispatch(
          connectWalletToPortfolio({
            id: portfolioId,
            data: {
              wallets: [
                {
                  name: updatedWallet.walletInfoName,
                  caip_address: updatedWallet.caipAddress,
                  connector: updatedWallet.walletInfoRdns,
                  connection_type: isManualInput,
                  wallet_address: updatedWallet.address,
                },
              ],
            },
          })
        ).unwrap();

        await dispatch(fetchWallets(portfolioId)).unwrap();
        closeAppKit?.();
        onSuccess?.();
      } catch (err) {
        toast.error("Помилка підключення гаманця.");
        console.error("❌ Wallet sync error:", err);
        handledKeyRef.current = ""; // щоб дозволити спробу ще раз
      }
    };

    sync();
  }, [connectWalletReown, portfolioId, listWalletsFromPortfolio]);
};
