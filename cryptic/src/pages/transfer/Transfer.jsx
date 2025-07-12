import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import showPassword from "../../assets/images/SignUp/eyeOff.svg";
import styles from "./Transfer.module.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/actions/authActions";
import toast, { Toaster } from 'react-hot-toast';
import MainNavbar from "../../components/navigation/Navbar/Main/Main";
import Footer from "../../components/navigation/Footer/Footer";
import openIcon from "../../assets/images/Dashboard/openIcon.svg";
import addressBook from "../../assets/images/Transfer/addressBook.svg";
import network from "../../assets/images/Transfer/network.svg";
import currencyImg from "../../assets/images/Dashboard/currencyImg.svg";
import { ethers } from "ethers";
import { useSendTransaction, useEstimateGas, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiAdapter, solanaWeb3JsAdapter, bitcoinAdapter, metadata, networks, projectId } from "../../lib/reownAppkit/reownAppkit";
import {
  useAppKitState,
  createAppKit,
  useAppKitEvents,
  useAppKitAccount,
  useWalletInfo,
} from '@reown/appkit/react'
import { cookieStorage, useAccount, useConnect, useConnectorClient, createStorage, useBalance } from 'wagmi';
import { useWallet } from "../../hooks/useWallet";

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
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [passwordShown, setPasswordShown] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [formattedBalance, setFormattedBalance] = useState('0');
  const { listWalletsFromPortfolio, loadingListWalletsFromPortfolio, errorListWalletsFromPortfolio } = useWallet();

  // Отримуємо баланс для адреси гаманця
  const { data: balanceData, isLoading: isBalanceLoading, error: balanceError } = useBalance({
    address: wallet?.wallet_address,
    watch: true,
  });

  // Форматуємо баланс для відображення
  useEffect(() => {
    if (balanceData?.value) {
      const balanceInEther = formatEther(balanceData?.value || 0n);
      const formattedValue = parseFloat(balanceInEther).toFixed(6);
      setFormattedBalance(formattedValue);
      console.log('Balance:', balanceInEther, 'ETH');
    } else {
      setFormattedBalance('0');
    }
  }, [balanceData]);

  const togglePasswordVisiblity = () => {
    setPasswordShown(prev => !prev);
  };

  const { register, handleSubmit, formState: { errors }, watch, reset, setValue } = useForm({
    mode: 'onChange',
    defaultValues: {
      addressFrom: wallet?.wallet_address ,
    }
  });

  const toAddress = watch('addressTo');
  const amount = watch('amountCurrency');

  // Оновлюємо дані гаманця при завантаженні
  useEffect(() => {
    if (listWalletsFromPortfolio && id) {
      const foundWallet = listWalletsFromPortfolio.find(w => w.id == id);
      console.log('Found wallet:', foundWallet);
      if (foundWallet) {
        setWallet(foundWallet);
        reset({ addressFrom: foundWallet.wallet_address });
      }
    }
  }, [listWalletsFromPortfolio, id, reset]);

  // Функція для встановлення максимальної суми
  const handleMaxAmount = () => {
    if (balanceData?.value) {
      const balanceInEther = formatEther(balanceData.value);
      // Залишаємо трохи ETH для комісії (приблизно 0.01 ETH)
      const maxAmount = Math.max(0, parseFloat(balanceInEther) - 0.01);
      setValue('amountCurrency', maxAmount.toString());
    }
  };

  // Оцінка газу для транзакції
  const { data: gasEstimate } = useEstimateGas({
    to: toAddress,
    value: amount ? (() => {
      try {
        return parseEther(amount);
      } catch (e) {
        return undefined;
      }
    })() : undefined,
    enabled: !!toAddress && !!amount && parseFloat(amount) > 0,
  });
const [shouldSendTx, setShouldSendTx] = useState(false);
  const { address: connectedAddress, isConnected, connector } = useAccount();
  const { connect, connectors } = useConnect();
  const { data: hash, error, isPending, sendTransaction } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

const onSubmit = async () => {
  if (!toAddress || !amount) {
    toast.error("Enter valid 'to' address and amount");
    return;
  }

  let parsedAmount;
  try {
    parsedAmount = parseEther(amount);
  } catch (error) {
    toast.error("Invalid amount format");
    return;
  }

  if (balanceData?.value && parsedAmount > balanceData.value) {
    toast.error("Insufficient balance");
    return;
  }

  if (!window.ethereum) {
    toast.error("Ethereum provider not found");
    return;
  }

  if (!isConnected) {
    const targetConnector = connectors.find(c => c.id === wallet.connector);
    if (targetConnector) {
      try {
        await connect({ connector: targetConnector });
        setShouldSendTx(true); // чекаємо isConnected
      } catch (err) {
        toast.error("Failed to connect wallet");
        console.error("Failed to connect wallet:", err);
        return;
      }
    } else {
      toast.error("Please connect your wallet first");
      return;
    }
  } else {
    setShouldSendTx(true); // вже підключено, відразу дозволяємо відправку
  }
};

useEffect(() => {
  const trySendTransaction = async () => {
    if (!shouldSendTx || !isConnected) return;

    let parsedAmount;
    try {
      parsedAmount = parseEther(amount);
    } catch {
      toast.error("Invalid amount format");
      setShouldSendTx(false);
      return;
    }

    try {
      await sendTransaction({
        to: toAddress,
        value: parsedAmount,
        gas: gasEstimate,
      });
    } catch (error) {
      console.error("Transaction error:", error);
      toast.error("Transaction failed");
    } finally {
      setShouldSendTx(false); // скидаємо прапорець
    }
  };

  trySendTransaction();
}, [isConnected, shouldSendTx]);

  useEffect(() => {
    if (isPending) {
      toast.loading('Waiting for confirmation...');
    } else {
      toast.dismiss();
    }
  }, [isPending]);

  useEffect(() => {
    if (isConfirmed) {
      toast.success('Transaction confirmed successfully!');
      navigate(-1);
    }
  }, [isConfirmed, navigate]);

  useEffect(() => {
    if (error) {
      toast.dismiss();
      toast.error('Transaction failed');
      console.error('Transaction error:', error);
    }
  }, [error]);

  return (
    <div className={styles.transferContent}>
      <MainNavbar />
      <div className={styles.transferWrapper}>
        <form className={styles.transferForm} onSubmit={handleSubmit(onSubmit)}>
          <h1>Transfer</h1>
{/*
          <div className={styles.changeCurrency}>
            <img className={styles.currencyImg} src={currencyImg} alt="Current Currency" />
            <span>ETH</span>
            <button className={styles.changeCurrencyButton} type="button">
              <img className={styles.openIcon} src={openIcon} alt="Open Currency" />
            </button>
          </div>
*/}
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
              <input
                {...register("addressFrom", { required: `${t('common.required')}` })}
                placeholder={t('0xb56D4902aA6C455c3D06555080B9512703e88FE2')}
                autoComplete="off"
                readOnly
              />
              <p>{errors.addressFrom?.message}</p>
            </div>

            <div className={styles.inputGroup}>
              <label>To</label>
              <input
                {...register("addressTo", { 
                  required: `${t('common.required')}`,
                  pattern: {
                    value: /^0x[a-fA-F0-9]{40}$/,
                    message: "Invalid Ethereum address"
                  }
                })}
                placeholder={t("Recipient's address")}
                autoComplete="off"
              />
              <i className={styles.openAddressBook} onClick={togglePasswordVisiblity}>
                <img className={styles.backgroundAddressBook} src={addressBook} alt="Address book" />
              </i>
              <p>{errors.addressTo?.message}</p>
            </div>

            <div className={styles.inputGroup}>
              <label>Amount</label>
              <input
                {...register("amountCurrency", { 
                  required: `${t('common.required')}`,
                  pattern: {
                    value: /^\d*\.?\d+$/,
                    message: "Invalid amount format"
                  },
                  validate: (value) => {
                    if (balanceData?.value) {
                      const inputAmount = parseFloat(value);
                      const maxAmount = parseFloat(formatEther(balanceData.value));
                      if (inputAmount > maxAmount) {
                        return "Amount exceeds available balance";
                      }
                    }
                    return true;
                  }
                })}
                placeholder={t("Enter amount")}
                autoComplete="off"
                type="number"
                step="0.000001"
                min="0"
              />
              <i className={styles.maxAmount} onClick={handleMaxAmount}>
                <span>Max</span>
              </i>
              <div className={styles.labelGroup}>
                <p>{errors.amountCurrency?.message}</p>
                <span className={styles.availableAmount}>
                  Available: {isBalanceLoading ? 'Loading...' : `${formattedBalance} ETH`}
                  {balanceError && <span style={{color: 'red'}}> (Error loading balance)</span>}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.manageForm}>
            <button 
              className={styles.cancelButton} 
              type="button"
              onClick={() => navigate(-1)}
            >
              {t("Cancel")}
            </button>
            <button 
              className={styles.nextButton} 
              type="submit"
              disabled={isPending || isBalanceLoading}
            >
              {isPending ? 'Processing...' : t("Next")}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}