import styles from "./WalletConnectModal.module.css";
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { openAppKit, wagmiConfig } from "../../../lib/reownAppkit/reownAppkit";
import { useDispatch } from "react-redux";
import { useWallet } from "../../../hooks/useWallet";
import { connectWalletToPortfolio } from "../../../store/slices/portfolioSlice";
import { usePortfolio } from "../../../hooks/usePortfolio";
import close from "../../../assets/images/PortfoliosCreateModals/close.svg";

import { fetchWallets } from "../../../store/slices/walletSlice";
const queryClient = new QueryClient();
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../../common/Loader/Loader';

export default function WalletConnectModal({ isOpen, onClose, id }) {
  const { t } = useTranslation();
  const { listWalletsFromPortfolio, loadingListWalletsFromPortfolio, errorListWalletsFromPortfolio }  = useWallet(); 
  console.log(id)
  const navigate = useNavigate();
  const { isAuth } = useAuth();
  const dispatch = useDispatch();
  const { connectWalletAddress } = useWallet();
  const { errorConnect, awaitConnect } = usePortfolio();
  const [currentStep, setCurrentStep] = useState(1);
  const [walletInput, setWalletInput] = useState("");
  const [isManualInput, setIsManualInput] = useState(0);
  const handledAddressRef = useRef(null);

  useEffect(() => {
    if (!isAuth) {
      navigate("/signin");
    }
  }, [isAuth, navigate]);

useEffect(() => {
  if (
    connectWalletAddress && connectWalletAddress!=null &&
    connectWalletAddress !== handledAddressRef.current
  ) {
    console.log('я підключив')
    handleWalletConnect(connectWalletAddress);
    handledAddressRef.current = connectWalletAddress;
  }
}, [connectWalletAddress]);

  const handleWalletConnect = async (walletAddress) => {
    if (!walletAddress) {
      toast.error('Wallet address not found');
      return;
    }
  
    // Отримуємо список вже підключених гаманців
    const isWalletAlreadyConnected = listWalletsFromPortfolio.some(
      (wallet) => wallet.wallet_address === walletAddress
    );
  
    if (isWalletAlreadyConnected) {
      return;
    }
  
    try {
      await dispatch(
        connectWalletToPortfolio({
          id: id,
          data: { 
            wallet_addresses: [walletAddress],
            connection_type: isManualInput,
          },
        })
      ).unwrap();

      await dispatch( fetchWallets(id) ).unwrap();

      onClose();

    } catch (error) {
      toast.error('Error connecting wallet');
      console.error('Error connecting wallet' + error);
    }
  };

  const handleManualInput = () => {
    if (walletInput.trim() !== "") {
      handleWalletConnect(walletInput);
    } else {
      toast.error('Please enter a wallet address');
    }
  };

  const onModalClick = (event) => {
    if (event.target.classList.contains(styles.modalWrapper)) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <div className={styles.modalWrapper} onClick={onModalClick}>
              <div className={styles.connectWalletContainer}>
                <button className={styles.closeButton} onClick={onClose}>
                  <img src={close} alt="Close" />
                </button>
                {awaitConnect ? (
                  <div className={styles.loader}>
                    <Loader />
                  </div>
                ):(
                  <div className={styles.card}>
                  <h2 className={styles.title}>{t("Connect Your Wallet")}</h2>
                  <p className={styles.subtitle}>{t("Choose a connection method")}</p>

                  <div className={styles.connectionOptions}>
                    <button
                      className={`${styles.optionButton} ${!isManualInput ? styles.selected : ""}`}
                      onClick={() => setIsManualInput(0)}
                    >
                      {t("Automatic connection")}
                    </button>
                    <button
                      className={`${styles.optionButton} ${isManualInput ? styles.selected : ""}`}
                      onClick={() => setIsManualInput(1)}
                    >
                      {t("Manual Input")}
                    </button>
                  </div>

                  {!isManualInput ? (
                    <div className={styles.web3ModalOption}>
                      <button onClick={openAppKit} className={styles.connectButton}>
                        {connectWalletAddress ? "Change wallet" : "Connect wallet"}
                      </button>
                    </div>
                  ) : (
                    <div>
                      <form className={styles.manualInputForm}>
                        <label htmlFor="addressInput">{t("Wallet Address")}</label>
                        <input
                          type="text"
                          id="addressInput"
                          className={styles.addressInput}
                          placeholder="Enter your wallet address"
                          value={walletInput}
                          onChange={(e) => setWalletInput(e.target.value)}
                          required
                        />
                      </form>
                      <button onClick={handleManualInput} className={styles.connectButton}>
                        Connect wallet
                      </button>
                    </div>
                  )}
                  </div>
                )}

              </div>
            </div>
          </QueryClientProvider>
        </WagmiProvider>
      )}
    </>
  );
}
