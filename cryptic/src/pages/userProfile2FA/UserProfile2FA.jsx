import { useState, useRef  } from "react";
import styles from "./UserProfile2FA.module.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Sidebar from "../../components/SideBarProfile";
import { useForm } from 'react-hook-form';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import QRCode from "../../assets/images/UserProfile/QRCode.svg";
import CopyAlt from "../../assets/images/UserProfile/CopyAlt.svg";


export default function UserProfile2FA() {
  const {t} = useTranslation();
  const { register, handleSubmit, formState: {errors} } = useForm({mode: 'onChange',});

  const onSubmit = (data) => {
    console.log(data);
  };
  const secretKeyRef = useRef(null);

  const copyToClipboard = () => {
    if (secretKeyRef.current) {
      const text = secretKeyRef.current.innerText.trim();
      navigator.clipboard.writeText(text)
        .then(() => console.log("Copied to clipboard!"))
        .catch((err) => console.error("Failed to copy: ", err));
    }
  };
  const handleInput = (e) => {
    const value = e.target.value;
    const inputs = e.target.parentElement.parentElement.querySelectorAll("input"); // Отримуємо всі input у контейнері
    const index = Array.from(inputs).indexOf(e.target); // Отримуємо індекс поточного input

    if (/^\d$/.test(value)) {
      e.target.value = value; // Дозволяємо тільки одну цифру
      if (index < inputs.length - 1) {
        inputs[index + 1].focus(); // Перехід на наступний input
      }
    } else {
      e.target.value = ""; // Видаляємо нецифрові символи
    }
  };

  const handleKeyDown = (e) => {
    const inputs = e.target.parentElement.parentElement.querySelectorAll("input");
    const index = Array.from(inputs).indexOf(e.target);

    if (e.key === "Backspace" && !e.target.value) {
      if (index > 0) {
        inputs[index - 1].focus(); // Перехід назад при натисканні Backspace
      }
    }
  };

  return (
    <>
    <main className={styles.main}>
      <Navbar/>
      <div className={styles.userProfile}>
    
        <div className={styles.userProfileContent}>
          <div className={styles.sideBar}> 
            <Sidebar/>
          </div>
          <div className={styles.userProfileInfo}> 
            <div className={styles.topic}>{t('userProfile2FA.topic')}</div>
            <div className={styles.textWithQR}>
              <div className={styles.textForQR}>
                <div className={styles.textTopic1}>{t('userProfile2FA.first')}</div>
                <div className={styles.textTopic2}>{t('userProfile2FA.second')}</div>
                <div className={styles.textTopic}>{t('userProfile2FA.secondText')}</div>
              </div>
              <div className={styles.imgQR}>
                 <img src={QRCode} alt="Show password" />
              </div>
            </div>
            <div className={styles.secretKey} ref={secretKeyRef}>
              7F3H5K6L8M2P1Q0R
              <img className={styles.copyIcon} src={CopyAlt} alt="Copy to clipboard" onClick={copyToClipboard}/>
            </div>

            <div className={styles.textTopic3}>{t('userProfile2FA.third')}</div>
            <div className={styles.inutCode}>
              <div className={styles.inutCodePart}>
                <input placeholder="0" autoComplete="off" maxLength="1" onInput={handleInput} onKeyDown={handleKeyDown} />
                <input placeholder="0" autoComplete="off" maxLength="1" onInput={handleInput} onKeyDown={handleKeyDown} />
                <input placeholder="0" autoComplete="off" maxLength="1" onInput={handleInput} onKeyDown={handleKeyDown} />
              </div>
              <div className={styles.inutCodePart}>
                <input placeholder="0" autoComplete="off" maxLength="1" onInput={handleInput} onKeyDown={handleKeyDown} />
                <input placeholder="0" autoComplete="off" maxLength="1" onInput={handleInput} onKeyDown={handleKeyDown} />
                <input placeholder="0" autoComplete="off" maxLength="1" onInput={handleInput} onKeyDown={handleKeyDown} />
              </div>
            </div>
            <div className={styles.buttonWrapper}>
                  <button className={styles.button} type="submit">{t('userProfile2FA.verify')}</button>
            </div>
          </div>
        </div>
   
      </div>
      <Footer/>
    </main>
    </>

  );
}
