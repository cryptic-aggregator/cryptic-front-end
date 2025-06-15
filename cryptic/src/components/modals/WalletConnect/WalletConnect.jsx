import styles from "./WalletConnect.module.css";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { wagmiAdapter,solanaWeb3JsAdapter, bitcoinAdapter, metadata,networks, projectId } from "../../../lib/reownAppkit/reownAppkit";
import { useDispatch } from "react-redux";
import { useWallet } from "../../../hooks/useWallet";
import { connectWalletToPortfolio } from "../../../store/slices/portfolioSlice";
import { usePortfolio } from "../../../hooks/usePortfolio";
import close from "../../../assets/images/PortfoliosCreateModals/close.svg";
import { useAppKitState, createAppKit, useDisconnect, useAppKitAccount } from '@reown/appkit/react'
import { useAccount } from 'wagmi';  
import { fetchWallets } from "../../../store/slices/walletSlice";
import toast from 'react-hot-toast';
import Loader from '../../common/Loader/Loader';

export default function WalletConnectModal({ isOpen, onClose, portfolioId }) {
  const { t } = useTranslation();
  const { listWalletsFromPortfolio, loadingListWalletsFromPortfolio, errorListWalletsFromPortfolio }  = useWallet(); 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { connectWalletReown } = useWallet();
  const { disconnect } = useDisconnect();
  const { errorConnect, awaitConnect } = usePortfolio();
  const [walletInput, setWalletInput] = useState("");
  const [isManualInput, setIsManualInput] = useState(0);
  const { connector } = useAccount();
  const {isConnected} = useAppKitAccount();
  const { open } = useAppKitState();

  const modal = createAppKit({
    adapters: [wagmiAdapter, solanaWeb3JsAdapter, bitcoinAdapter],
    networks,
    projectId,
    metadata,
    features: {
      email: false,
      analytics: false,
      socials: false,
      emailShowWallets: false,
      legalCheckbox: true,
    },
    allWallets: 'SHOW',
  });

  const updateWalletState = async () => {
    const address = modal.getAddress();
    if (!address) {
      toast.error(t("modals.connectWallet.toast.walletNotFound"));
      return;
    }

      const caipAddress = modal.getCaipAddress();
      const info = modal.getWalletInfo() || {};
      const providerObj = modal.getWalletProvider();
      let provider = "unknown";
      if (providerObj) {
        if (typeof providerObj.name === "string") provider = providerObj.name;
        else if (providerObj.constructor?.name) provider = providerObj.constructor.name;
        else if (typeof providerObj.walletName === "string") provider = providerObj.walletName;
      }

    // Check if already connected
    const isWalletAlreadyConnected = listWalletsFromPortfolio.some(
      (wallet) => wallet.wallet_address === address
    );
    if (isWalletAlreadyConnected) {
      toast.error(t("modals.connectWallet.toast.alreadyConnected"));
      modal.close();
      return;
    }

    const updatedWalletInfo = {
      name: info.name || connector?.name || provider || "",
      rdns: info.rdns || connector?.id || "",
    };
    console.log(updatedWalletInfo);
    try {
      await dispatch(
        connectWalletToPortfolio({
          id: portfolioId,
          data: {
            wallets: [
              {
                name: updatedWalletInfo.name,
                caip_address: caipAddress,
                connector: updatedWalletInfo.rdns,
                connection_type: isManualInput,
                wallet_address: address,
              },
            ],
          },
        })
      ).unwrap();
      modal.close();
      console.log("🔒 Closing AppKit modal...");
      onClose();
    } catch (error) {
      toast.error(t("modals.connectWallet.toast.errorConnecting"));
      console.error("Error connecting wallet", error);
    }
  };

  useEffect(() => {
    if (!isConnected || !open) return;
    setTimeout(() => {
      updateWalletState();
      disconnect();
    }, 500); 
  }, [isConnected]);


  function isValidWalletAddress(address) {
    // Ethereum address: 0x + 40 hex символів
    const ethRegex = /^0x[a-fA-F0-9]{40}$/;

    // Solana address: Base58 строка, зазвичай 32–44 символів
    const solRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

    // Bitcoin address: починається з 1, 3 або bc1 (спрощено)
    const btcRegex = /^(1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,39}$/;

    return ethRegex.test(address) || solRegex.test(address) || btcRegex.test(address);
  }

  const handleWalletConnect = async (walletAddress) => {
    if (!walletAddress) {
      toast.error(t("modals.connectWallet.toast.walletNotFound"));
      return;
    }
  
    // Отримуємо список вже підключених гаманців
    const isWalletAlreadyConnected = listWalletsFromPortfolio.some(
      (wallet) => wallet.wallet_address === walletAddress
    );

    if (isWalletAlreadyConnected) {
      toast.error(t("modals.connectWallet.toast.alreadyConnected"));
      return;
    }
  
    try {
      await dispatch(
        connectWalletToPortfolio({
          id: portfolioId,
          data: {
            wallets: [
              {
                name: "",
                caip_address: "",
                connector: "",
                connection_type: isManualInput,
                wallet_address: walletAddress
              },
            ],
          },
        })
      ).unwrap();
      modal.close();
      onClose();
    } catch (error) {
      toast.error(t("modals.connectWallet.toast.errorConnecting"));
      console.error('Error connecting wallet' + error);
    }
  };

  const handleManualInput = () => {
    if (walletInput.trim() === "") {
      toast.error(t("modals.connectWallet.toast.pleaseEnter"));
      return;
    }

    if (!isValidWalletAddress(walletInput.trim())) {
      toast.error(t("modals.connectWallet.toast.invalidAddress"));
      return;
    }

    handleWalletConnect(walletInput.trim());
  };

  const onModalClick = (event) => {
    if (event.target.classList.contains(styles.modalWrapper)) {
      modal.close();
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
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
                  <h2 className={styles.title}>{t("modals.connectWallet.title")}</h2>
                  <p className={styles.subtitle}>{t("modals.connectWallet.subtitle")}</p>

                  <div className={styles.connectionOptions}>
                    <button
                      className={`${styles.optionButton} ${!isManualInput ? styles.selected : ""}`}
                      onClick={() => setIsManualInput(0)}
                    >
                      {t("modals.connectWallet.connectionOptions.automatic")}
                    </button>
                    <button
                      className={`${styles.optionButton} ${isManualInput ? styles.selected : ""}`}
                      onClick={() => setIsManualInput(1)}
                    >
                      {t("modals.connectWallet.connectionOptions.manual")}
                    </button>
                  </div>

                  {!isManualInput ? (
                    <div className={styles.web3ModalOption}>
                      <button onClick={() => modal.open()} className={styles.connectButton}>
                         {t("modals.connectWallet.connect")}
                      </button>
                    </div>
                  ) : (
                    <div>
                      <form className={styles.manualInputForm}>
                        <label >{t("modals.connectWallet.walletAddress")}</label>
                        <input
                          type="text"
                          id="addressInput"
                          className={styles.addressInput}
                          placeholder={t("modals.connectWallet.walletAddressPlaceholder")}
                          value={walletInput}
                          onChange={(e) => setWalletInput(e.target.value)}
                          required
                        />
                      </form>
                      <button onClick={handleManualInput} className={styles.connectButton}>
                        {t("modals.connectWallet.connect")}
                      </button>
                    </div>
                  )}
                  </div>
                )}

              </div>
            </div>
      )}
    </>
  );
}
