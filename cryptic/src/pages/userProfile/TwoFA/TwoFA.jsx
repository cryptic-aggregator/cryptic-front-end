import { useEffect, useRef, useState  } from "react";
import styles from "./TwoFA.module.css";
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import QRCode from "../../../assets/images/UserProfile/QRCode.svg";
import CopyAlt from "../../../assets/images/UserProfile/CopyAlt.svg";
import { QRCodeCanvas } from "qrcode.react";
import { useDispatch } from "react-redux";
import { fetchUser, sendCodeTwoFactor, setupTwoFactor } from "../../../store/slices/userSlice";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/common/Loader/Loader";

export default function TwoFA() {
  const {t} = useTranslation();
  const { register, handleSubmit, formState: {errors} } = useForm({mode: 'onChange',});
  const [secret, setSecret] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    dispatch(setupTwoFactor())
      .unwrap()
      .then((data) => {
        setSecret(data.secret);
        setQrCode(data.qrCodeBase64);
      })
      .catch((error) => {
        console.error("setupTwoFactor error:", error);
      });
  }, [dispatch]);



  const onSubmit = (data) => {
    console.log(data);
  };
  const secretKeyRef = useRef(null);

  const copyToClipboard = () => {
    if (secretKeyRef.current) {
      const text = secretKeyRef.current.innerText.trim();
      navigator.clipboard.writeText(text)
        .then(() =>
          toast.success(t('profile.twoFA.toast.successCopy')))
        .catch((err) => toast.error("Failed to copy: ", err));
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
      // Перевірка: всі інпути заповнені по 1 цифрі
      const code = Array.from(inputs).map(input => input.value).join('');
      if (code.length === inputs.length && /^\d{6}$/.test(code)) {
        console.log("Sending code:", code);
        dispatch(sendCodeTwoFactor({code: code}))
          .unwrap()
          .then(() => {
            toast.success(t('profile.twoFA.toast.successConnection'));
            dispatch(fetchUser())
            navigate('/twoAuthenticator/disable');
          })
          .catch((error) => {
            toast.error(t('profile.twoFA.toast.errorConnection'));
            console.error("setupTwoFactor error:", error);
          });
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

            <div className={styles.topic}>{t('profile.twoFA.topic')}</div>
            <div className={styles.textWithQR}>
              <div className={styles.textForQR}>
                <div className={styles.textTopic1}>{t('profile.twoFA.first')}</div>
                <div className={styles.textTopic2}>{t('profile.twoFA.second')}</div>
                <div className={styles.textTopic}>{t('profile.twoFA.secondText')}</div>
              </div>
              <div className={styles.imgQR}>
                {qrCode && (
                  <img src={`data:image/png;base64,${qrCode}`} alt="QR Code" />
                )}
              </div>
            </div>
            <div className={styles.secretKey} ref={secretKeyRef}>
              {secret}
              <img
                className={styles.copyIcon}
                src={CopyAlt}
                alt="Copy to clipboard"
                onClick={copyToClipboard}
              />
            </div>

            <div className={styles.textTopic3}>{t('profile.twoFA.third')}</div>
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
                  <button className={styles.button} type="submit">{t('profile.twoFA.verify')}</button>
            </div>

    </>

  );
}
