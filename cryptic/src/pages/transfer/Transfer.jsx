import { useState } from "react";
import { useForm } from 'react-hook-form';
import showPassword from "../../assets/images/SignUpPage/eyeOff.svg";
import styles from "./Transfer.module.css";
import { Link,useNavigate  } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/actions/authActions";
import toast, { Toaster } from 'react-hot-toast';
import MainNavbar from "../../components/navigation/MainNavbar/MainNavbar";
import Footer from "../../components/layout/Footer/Footer";
import openIcon from "../../assets/images/Dashboard/openIcon.svg";
import addressBook from "../../assets/images/Transfer/addressBook.svg";
import network from "../../assets/images/Transfer/network.svg";
import currencyImg from "../../assets/images/Dashboard/currencyImg.svg";
import { ethers } from "ethers";
import { useSendTransaction, useEstimateGas } from 'wagmi';
import { parseEther, } from 'viem';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiAdapter,solanaWeb3JsAdapter, bitcoinAdapter, metadata,networks, projectId } from "../../lib/reownAppkit/reownAppkit";
import {
    useAppKitState,
    createAppKit,
    useAppKitEvents,
    useAppKitAccount,
    useWalletInfo,
     } from '@reown/appkit/react'
import { cookieStorage, useAccount, useConnect, useConnectorClient, createStorage } from 'wagmi';
     
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


export default function Transfer() {
    const {t} = useTranslation();
    const { connect, connectors, isPending } = useConnect();
    const dispatch = useDispatch();

      //show password
      const [passwordShown, setPasswordShown] = useState(false);
      const navigate = useNavigate();

      const [formData, setFormData] = useState({
        email: '',
        password: ''
      });

      const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
      };


    const { register, handleSubmit, formState: {errors}, watch  } = useForm({mode: 'onChange',});
    
    const toAddress = watch('addressTo');
    const amount = watch('amountCurrency');

    const { data: gasEstimate } = useEstimateGas({
      to: toAddress,
      value: amount ? parseEther(amount) : undefined,
      enabled: !!toAddress && !!amount,
    });


    const { address: connectedAddress, isConnected, connector } = useAccount();

    
const { sendTransactionAsync } = useSendTransaction();


const onSubmit = async () => {
    if (!isConnected) {
      if(wallet?.connector){
          const сonnector = connectors.find(c => c.id === wallet.connector);
          if (сonnector) {
            try {
              await connect({ connector: сonnector });
              return; 
            } catch (err) {
              toast.error("Failed to connect wallet");
              console.error("Failed to connect wallet:", err);
              return;
            }
          } else {
            toast.error("Please connect your wallet first");
            return;
          }
        }
    }

    if (!toAddress || !amount) {
      toast.error("Enter valid 'to' address and amount");
      return;
    }

    try {
        toast.loading("Waiting for confirmation...");
        // Sending a transaction
        const tx = await sendTransactionAsync({
          to: toAddress,
          value: parseEther(amount),
          gas: gasEstimate,
        });

        if (!tx?.hash) {
          toast.error("Transaction was not sent properly");
          return;
        }

        // Waiting for transaction confirmation
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.waitForTransaction(tx.hash, 1);

        toast.dismiss();
        toast.success("Transaction confirmed successfully!");

      } catch (error) {
        toast.dismiss();
        toast.error("Transaction failed");
        console.error("Transaction error:", error);
      }

};

    
  return (
    <>

      <div className={styles.transferContent}>
        <MainNavbar/>
        <div className={styles.transferWrapper}>
          <form className={styles.transferForm} onSubmit={handleSubmit(onSubmit)}>
            
            <h1>Transfer</h1>

     
            <div className={styles.changeCurrency}>
              <img className={styles.currencyImg} src={currencyImg} alt="Current Currency" />
              <span>USDT</span>
              <button className={styles.changeCurrencyButton}>
                <img className={styles.openIcon} src={openIcon} alt="Open Currency" />
              </button>
            </div>

            <div className={styles.inputForm}>
                <div className={styles.inputGroup}>
                  <div className={styles.labelGroup}>
                    <label>From</label>
                    <div className={styles.networkNameWrapper}>
                      <div className={styles.networkName}>
                      <img className={styles.networkImg} src={network} alt="Network" />
                      <label>Ethereum</label>
                      </div>
                    </div>
                  </div>
                  <input {...register("addressFrom", { 
                    required: `${t('signIn.required')}`,
                  })} 
                  placeholder={t('0xb56D4902aA6C455c3D06555080B9512703e88FE2')} autoComplete="off"
                  />
                  <p>{errors.addressFrom?.message}</p>
                </div>

                <div className={styles.inputGroup}>
                  <label>To</label>
                  <input {...register("addressTo", { 
                    required: `${t('signIn.required')}`, 
                  })} 
                  placeholder={t('Recipient`s address')}  autoComplete="off"/>
                  <i className={styles.openAddressBook} onClick={togglePasswordVisiblity}><img className={styles.backgroundAddressBook} src={addressBook} alt="Show password" /></i>
                  <p>{errors.addressTo?.message}</p>
                </div>

                <div className={styles.inputGroup}>
                  <label>Amount</label>
                  <input {...register("amountCurrency", { 
                    required: `${t('signIn.required')}`, 
                  })} 
                  placeholder={t('Enter amount')}  autoComplete="off"/>
                  <i className={styles.maxAmount} onClick={togglePasswordVisiblity}>
                    <span>Max</span>
                  </i>
                  <div className={styles.labelGroup}>
                    <p>{errors.amountCurrency?.message}</p>
                    <span className={styles.availableAmount}>Available 3 USDT</span>
                  </div>
                </div>
            </div>

            <div className={styles.manageForm}>
              <button className={styles.cancelButton} >{t('Cancel')}</button>
              <button className={styles.nextButton} type="submit" >{t('Next')}</button>
            </div>
          </form>
        </div>
        <Footer/>
      </div>

    </>

  );
}
