import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navigation/MainNavbar/MainNavbar";
import Footer from "../../components/layout/Footer/Footer";
import styles from "./ConnectWallet.module.css";
import { wagmiAdapter,solanaWeb3JsAdapter, bitcoinAdapter, metadata,networks, projectId } from "../../lib/reownAppkit/reownAppkit";
import { useDispatch } from "react-redux";
import { addPortfolioAndConnectWallet  } from "../../store/slices/portfolioSlice";
import { usePortfolio } from "../../hooks/usePortfolio";
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader/Loader';
import Error from '../../components/common/Error/Error';
import {useAppKitState, createAppKit, useDisconnect, useAppKitAccount} from '@reown/appkit/react'
import { useAccount } from 'wagmi';  

export default function ConnectWallet() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [connectWallet, setConnectWallet] = useState(null);
  const { errorConnect, awaitConnect }  = usePortfolio(); 
  const [currentStep, setCurrentStep] = useState(1);
  const [portfolioName, setPortfolioName] = useState("");
  const [isManualInput, setIsManualInput] = useState(0);
  const {isConnected} = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const { connector } = useAccount();
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

      const updatedWalletInfo = {
        name: info.name || connector?.name || provider || "",
        rdns: info.rdns || connector?.id || "",
      };
      console.log(updatedWalletInfo);

    setConnectWallet({
      name: updatedWalletInfo.name,
      caip_address: caipAddress,
      connector: updatedWalletInfo.rdns,
      connection_type: isManualInput,
      wallet_address: address,
    });

    modal.close();
    console.log("🔒 Closing AppKit modal...");
  };

  const createPorfolioConnectWallet = async() => {
      if(portfolioName && connectWallet){
        try {
          await dispatch(addPortfolioAndConnectWallet({
            namePortfolio:{ name: `${portfolioName}` },
            wallets:{
                wallets: [{ ...connectWallet }],
              },
          })).unwrap();
          setConnectWallet(null)
          navigate("/dashboard")
        } catch (error) {
          toast.error('Error connecting wallet');
          console.error('Error connecting wallet' + error);
        }

      }else if(!portfolioName){
        toast.error('Portfolio name not find');
      }else{
        toast.error('Connect wallet address not find');
      }
  };

  useEffect(() => {
    if (!isConnected || !open) return;
    setTimeout(() => {
      updateWalletState();
      disconnect();
      setCurrentStep(2);
    }, 500); 
  }, [isConnected]);
  
   const handleWalletConnect = (walletAddress) => {
      setConnectWallet({
        name: "",
        caip_address: "",
        connector: "",
        connection_type: isManualInput,
        wallet_address: walletAddress,
      });
  };
  return (
        <main className={styles.main}>
          <Navbar />
          <div className={styles.userConnectWallet}>
            <div className={styles.connectWalletContainer}>
              {currentStep === 1 && (
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
                    <>
                      {connectWallet?.wallet_address && (
                        <div className={styles.card}>
                          <p className={styles.subtitle}>{t("You choose wallet:")} {connectWallet.wallet_address.slice(0, 8)}...{connectWallet.wallet_address.slice(-5)}</p>
                        </div>
                      )}

                      <div className={styles.web3ModalOption}>
                        <button onClick={() => modal.open()} className={styles.connectButton}>
                          {connectWallet ? (`Change wallet`):(`Connect wallet`)}
                        </button>
                      </div>
                    </>
                  ) : (
                    <form className={styles.manualInputForm}>
                      <label htmlFor="addressInput">{t("Wallet Address")}</label>
                      <input
                        type="text"
                        id="addressInput"
                        className={styles.addressInput}
                        placeholder="Enter your address wallet"
                        onChange={(e) => handleWalletConnect(e.target.value)}
                        required
                      />

                    </form>
                  )}
                  <div className={styles.navigationButtonsFirstPage}>
                    <button className={styles.nextButton} onClick={() => setCurrentStep(2)}>
                      {t("Next")}
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                awaitConnect ? (
                  <div className={styles.card}>
                    <Loader />
                  </div>
                ):(
                  <div className={styles.card}>
                  <p className={styles.title}>{t("Enter the name of your portfolio where this wallet will be located.")}</p>
                  <input
                    type="text"
                    className={styles.addressInput}
                    placeholder={t("Portfolio Name")}
                    value={portfolioName}
                    onChange={(e) => setPortfolioName(e.target.value)}
                  />

                  <div className={styles.navigationButtons}>
                    <button className={styles.backButton} onClick={() => setCurrentStep(1)}>
                      {t("Back")}
                    </button>
                    <button className={styles.createButton} onClick={() => createPorfolioConnectWallet()}>
                      {t("Create")}
                    </button>
                  </div>
                </div>
                )
              )}

              <div className={styles.pageIndicators}>
                <span onClick={() => setCurrentStep(1)} className={`${styles.indicator} ${currentStep === 1 ? styles.active : ""}`} />
                <span onClick={() => setCurrentStep(2)}className={`${styles.indicator} ${currentStep === 2 ? styles.active : ""}`} />
              </div>
            </div>
          </div>
          <Footer />
        </main>
  );
}
