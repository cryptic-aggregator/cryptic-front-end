import { useState, useRef  } from "react";
import styles from "./UserProfile2FADisable.module.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Sidebar from "../../components/SideBarProfile";
import { useForm } from 'react-hook-form';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import QRCode from "../../assets/images/UserProfile/QRCode.svg";
import CopyAlt from "../../assets/images/UserProfile/CopyAlt.svg";
import showPassword from "../../assets/images/SignUpPage/eyeOff.svg";

export default function UserProfile2FA() {
  const {t} = useTranslation();
  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordConfirmShown, setPasswordConfirmShown] = useState(false);
  let password;
  
  const { register, handleSubmit, watch, formState: {errors} } = useForm({mode: 'onChange',});
  password = watch("password", "");

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  const togglePasswordConfirmVisiblity = () => {
    setPasswordConfirmShown(passwordConfirmShown ? false : true);
  };

  const onSubmit = (data) => {
    console.log(data);
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
              <div className={styles.topic}>{t('userProfile2FADisable.topic')}</div>
              <div className={styles.textTopic}>{t('userProfile2FADisable.topic')}</div>

              <form className={styles.registerForm} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.inputForm}>

                  <div className={styles.inputGroup}>
                    <label>{t('userProfile2FADisable.passwordTopic')}</label>
                    <input {...register("password", { 
                      required: `${t('userProfile2FADisable.required')}`
                    })} 
                    type={passwordShown ? "text" : "password"} placeholder={t('userProfile2FADisable.placeholderPassword')} autoComplete="off"/>
                    <i className={styles.passwordShown} onClick={togglePasswordVisiblity}><img className={styles.backgroundGoals} src={showPassword} alt="Show password" /></i>
                    <p>{errors.password?.message}</p>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>{t('userProfile2FADisable.FATopic')}</label>
                    <input {...register("2FACode", { 
                      required: `${t('userProfile2FA.required')}`
                    })}  
                    type={passwordConfirmShown ? "text" : "password"}placeholder={t('userProfile2FADisable.placeholderFA')} autoComplete="off"/>
                    <i className={styles.passwordConfirmShown} onClick={togglePasswordConfirmVisiblity}><img className={styles.backgroundGoals} src={showPassword} alt="Show password" /></i>
                    <p>{errors.confirmPassword?.message}</p>
                  </div>

                </div>
                <div className={styles.buttonWrapper}>
                  <button className={styles.button} type="submit">{t('userProfile2FADisable.disable')}</button>
              </div>
              </form>
              
          </div>
        </div>
   
      </div>
      <Footer/>
    </main>
    </>

  );
}
