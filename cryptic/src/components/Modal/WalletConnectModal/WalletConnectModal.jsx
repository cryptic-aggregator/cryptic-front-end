import styles from "./WalletConnectModal.module.css";
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { closeAppKit, wagmiAdapter,solanaWeb3JsAdapter, bitcoinAdapter, metadata,networks, projectId } from "../../../lib/reownAppkit/reownAppkit";
import { useDispatch } from "react-redux";
import { useWallet } from "../../../hooks/useWallet";
import { connectWalletToPortfolio } from "../../../store/slices/portfolioSlice";
import { usePortfolio } from "../../../hooks/usePortfolio";
import close from "../../../assets/images/PortfoliosCreateModals/close.svg";
import store from '../../../store/index.js';
import { setWalletConnectionReown, clearWalletConnectionReown } from '../../../store/slices/walletSlice.js';

import {
    useAppKitState,
    createAppKit,
    useAppKitEvents,
    useAppKitAccount,
    useWalletInfo,
     } from '@reown/appkit/react'
import { cookieStorage, useAccount, useConnect, useConnectorClient, createStorage } from 'wagmi';
     
import { fetchWallets } from "../../../store/slices/walletSlice";
const queryClient = new QueryClient();
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../../common/Loader/Loader';

export default function WalletConnectModal({ isOpen, onClose, id }) {
  const { t } = useTranslation();
  const { listWalletsFromPortfolio, loadingListWalletsFromPortfolio, errorListWalletsFromPortfolio }  = useWallet(); 
  const navigate = useNavigate();
  const { isAuth } = useAuth();
  const dispatch = useDispatch();
  const { connectWalletReown } = useWallet();
  const { errorConnect, awaitConnect } = usePortfolio();
  const [currentStep, setCurrentStep] = useState(1);
  const [walletInput, setWalletInput] = useState("");
  const [isManualInput, setIsManualInput] = useState(0);
  const handledAddressRef = useRef(null);
  const { walletInfo } = useWalletInfo();
  const { connector } = useAccount();
  const {address, caipAddress, isConnected, status, embeddedWalletInfo } = useAppKitAccount();

  useEffect(() => {
    if (!isAuth) {
      navigate("/signin");
    }
  }, [isAuth, navigate]);

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
    toast.error("Wallet address not found");
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

  // Перевірка чи вже підключено
  const isWalletAlreadyConnected = listWalletsFromPortfolio.some(
    (wallet) => wallet.wallet_address === address
  );
  if (isWalletAlreadyConnected) {
    toast.error("The wallet is already connected.");
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
        id,
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

    await dispatch(fetchWallets(id)).unwrap();
    modal.adapter?.connectionControllerClient?.disconnect();
    modal.close();
    console.log("🔒 Closing AppKit modal...");
    onClose();
  } catch (error) {
    toast.error("Error connecting wallet");
    console.error("Error connecting wallet", error);
  }
  
};


useEffect(() => {

  if (!isConnected || !open) return;
  setTimeout(() => {
    updateWalletState();
  }, 500);
  
}, [isConnected]);

/*
useEffect(() => {
  handledAddressRef.current = ""; // скидуємо при переході між портфоліо
}, [id]);

const syncWalletToPortfolio = async (connectWallet) => {
  try {
  let updatedWallet = { ...connectWallet }; // створюємо копію

  if(updatedWallet){
    if (updatedWallet.walletInfoName=="") {
      if (connector?.name) {
        updatedWallet.walletInfoName = connector.name;
      } else if (updatedWallet.providerName) {
        updatedWallet.walletInfoName = updatedWallet.providerName;
      }
    }
    if (updatedWallet.walletInfoRdns=="") {
      if (connector?.id) {
        updatedWallet.walletInfoRdns = connector.id;
      }
    }

    console.log("address:", updatedWallet.address);
    console.log("caipAddress:", updatedWallet.caipAddress);
    console.log("Wallet Rdns:", updatedWallet.walletInfoRdns);
    console.log("Wallet name:", updatedWallet.walletInfoName);
  }

    await dispatch(
      connectWalletToPortfolio({
        id: id,
        data: {
          wallets: [{
            name: updatedWallet.walletInfoName,
            caip_address: updatedWallet.caipAddress,
            connector: updatedWallet.walletInfoRdns,
            connection_type: isManualInput,
            wallet_address: updatedWallet.address
          }]
        },
      })
    ).unwrap();

    await dispatch(fetchWallets(id)).unwrap();
    closeAppKit() 
    onClose();
  } catch (error) {
    toast.error('Error syncing wallet');
    handledAddressRef.current = null;
    console.error('❌ Error syncing wallet:', error);
  }
};

*/

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
      toast.error('The wallet is already connected.');
      return;
    }
  
    try {
      await dispatch(
        connectWalletToPortfolio({
          id: id,
          data: {
            wallets: [{
              name: "",
              caip_address: "",
              connector: "",
              connection_type: isManualInput,
              wallet_address: walletAddress
            }]
          },
        })
      ).unwrap();

      await dispatch( fetchWallets(id) ).unwrap();
      closeAppKit() 
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
      closeAppKit() 
    }
  };

  return (
    <>
      {isOpen && (
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
                      <button onClick={() => modal.open()} className={styles.connectButton}>
                        {connectWalletReown ? "Change wallet" : "Connect wallet"}
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

      )}
    </>
  );
}
