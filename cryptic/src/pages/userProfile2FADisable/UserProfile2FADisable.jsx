import { useState  } from "react";
import styles from "./UserProfile2FADisable.module.css";

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import showPassword from "../../assets/images/SignUpPage/eyeOff.svg";
import { disableTwoFactor, fetchUser } from "../../store/slices/userSlice";
import { useDispatch } from "react-redux";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

export default function UserProfile2FA() {
  const {t} = useTranslation();
  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordConfirmShown, setPasswordConfirmShown] = useState(false);
  const dispatch = useDispatch();
    const navigate = useNavigate();
  let password;
  
  const { register, handleSubmit, watch, formState: {errors} } = useForm({mode: 'onChange',});
  password = watch("password", "");

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  const togglePasswordConfirmVisiblity = () => {
    setPasswordConfirmShown(passwordConfirmShown ? false : true);
  };

  const disable2FA = () => {
    dispatch(disableTwoFactor())
      .unwrap()
      .then(() => {
        toast.success('Successful disabling Two Factor Authentication');
        dispatch(fetchUser())
        navigate('/twoAuthenticator');
      })
      .catch((error) => {
        console.error("setupTwoFactor error:", error);
      });
  };

  return (
    <>

              <div className={styles.topic}>{t('userProfile2FADisable.topic')}</div>
              <div className={styles.textTopic}>{t('userProfile2FADisable.first')}</div>
              {/*
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
              </form>*/}
               <div className={styles.buttonWrapper}>
                  <button onClick={disable2FA} className={styles.button} type="submit">{t('userProfile2FADisable.disable')}</button>
              </div>

    </>

  );
}
