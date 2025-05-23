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

async function sendTransaction(recipientAddress, amount, privateKey) {
  // Створення інстансу провайдера
  const provider = new ethers.JsonRpcProvider("https://mainnet.infura.io/v3/292ef0994972ab36ceb67522a5f9a3b4");
  
  // Створення гаманця з приватним ключем
  const wallet = new ethers.Wallet(privateKey, provider);
  
  // Базові параметри транзакції
  const tx = {
    to: recipientAddress,
    value: ethers.parseEther(amount)
  };
  
  // Підписування та відправка транзакції
  const transaction = await wallet.sendTransaction(tx);
  console.log("Transaction hash:", transaction.hash);
  
  // Очікування підтвердження
  const receipt = await transaction.wait();
  return receipt;
}


export default function Transfer() {
    const {t} = useTranslation();
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

    const { register, handleSubmit, formState: {errors} } = useForm({mode: 'onChange',});

    const onSubmit = async (data) => {
      try {
        const userData = {
          email: data.email,
          password: data.password
        };
        await dispatch(loginUser(userData)).unwrap();
        navigate('/dashboard');

      } catch (error) {
        toast.error('Login failed');
        console.error('Login failed:', error);
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
                <p>{errors.email?.message}</p>
              </div>

              <div className={styles.inputGroup}>
                <label>To</label>
                <input {...register("addressTo", { 
                  required: `${t('signIn.required')}`, 

                })} 
                placeholder={t('Recipient`s address')}  autoComplete="off"/>
                <i className={styles.openAddressBook} onClick={togglePasswordVisiblity}><img className={styles.backgroundAddressBook} src={addressBook} alt="Show password" /></i>
                <p>{errors.password?.message}</p>
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
                  <p>{errors.password?.message}</p>
                  <span className={styles.availableAmount}>Available 3 USDT</span>
                </div>
              </div>
          </div>

          <div className={styles.manageForm}>
            <button className={styles.cancelButton} type="submit" >{t('Cancel')}</button>
            <button className={styles.nextButton} type="submit" >{t('Next')}</button>
          </div>
        </form>
      </div>
      <Footer/>
    </div>

    </>

  );
}
