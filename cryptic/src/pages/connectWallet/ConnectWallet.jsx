import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Navbar from "../../components/navigation/MainNavbar/MainNavbar";
import Footer from "../../components/layout/Footer/Footer";
import styles from "./ConnectWallet.module.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { openAppKit, wagmiConfig } from "../../lib/reownAppkit/reownAppkit";
import { useDispatch, useSelector } from "react-redux";
import { setWalletConnectionReown } from "../../store/slices/walletSlice";
import { useWallet } from "../../hooks/useWallet";
import { addPortfolioAndConnectWallet  } from "../../store/slices/portfolioSlice";
import { usePortfolio } from "../../hooks/usePortfolio";
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../../components/common/Loader/Loader';
import Error from '../../components/common/Error/Error';

export default function ConnectWallet() {
  const queryClient = new QueryClient();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuth } = useAuth();
  const dispatch = useDispatch();
  const { connectWalletAddress }  = useWallet(); 
  const { errorConnect, awaitConnect }  = usePortfolio(); 
  const [currentStep, setCurrentStep] = useState(1);
  const [portfolioName, setPortfolioName] = useState("");
  const [isManualInput, setIsManualInput] = useState(0);
  useEffect(() => {
    if (!isAuth) {
      navigate("/signin");
    }
  }, [isAuth, navigate]);
  
    const createPorfolioConnectWallet = async() => {
        if(portfolioName && connectWalletAddress){

          try {
              await dispatch(addPortfolioAndConnectWallet({
              namePortfolio:{ name: `${portfolioName}` },
              wallets:{ 
                wallet_addresses: [`${connectWalletAddress}`],
                connection_type: isManualInput,
              },
            })).unwrap();
            
            navigate("/dashboard")
          } catch (error) {
            toast.error('Error connecting wallet');
            console.error('Error connecting wallet' + error);
          }

        }else if(portfolioName){
          toast.error('Portfolio name not find');
        }else{
          toast.error('Connect wallet address not find');
        }
  };

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
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
                      {connectWalletAddress && (
                        <div className={styles.card}>
                          <p className={styles.subtitle}>{t("You choose wallet:")} {connectWalletAddress.slice(0, 8)}...{connectWalletAddress.slice(-5)}</p>
                        </div>
                      )}

                      <div className={styles.web3ModalOption}>
                        <button onClick={openAppKit} className={styles.connectButton}>
                          {connectWalletAddress ? (`Change wallet`):(`Connect wallet`)}
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
                        onChange={(e) => dispatch(setWalletConnectionReown(e.target.value))}
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
              {/* Індикатори сторінок */}
              <div className={styles.pageIndicators}>
                <span onClick={() => setCurrentStep(1)} className={`${styles.indicator} ${currentStep === 1 ? styles.active : ""}`} />
                <span onClick={() => setCurrentStep(2)}className={`${styles.indicator} ${currentStep === 2 ? styles.active : ""}`} />
              </div>
            </div>
          </div>
          <Footer />
        </main>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
