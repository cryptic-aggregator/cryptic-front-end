import { useState } from "react";
import { useForm } from 'react-hook-form';
import showPassword from "../../assets/images/SignUp/eyeOff.svg";
import styles from "./SignIn.module.css";
import { Link,useNavigate  } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/actions/authActions";
import toast, { Toaster } from 'react-hot-toast';

export default function SignIn() {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const [requires2FA, setRequires2FA] = useState(false);
      //show password
      const [passwordShown, setPasswordShown] = useState(false);
      const navigate = useNavigate();

      const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
      };

    const { register, handleSubmit, formState: {errors} } = useForm({mode: 'onChange',});

    const onSubmit = async (data) => {
      try {
        const userData = {
          email: data.email,
          password: data.password,
          code: data.twoFACode
        };
        const resultAction = await dispatch(loginUser(userData)).unwrap();

        if (resultAction.requires2FA) {
          setRequires2FA(true);
          toast.error(t('auth.signIn.enter2FACode'));
          return;
        }
        navigate('/dashboard');

      } catch (error) {
        toast.error(t('auth.signIn.failedSignIn'));
        console.error('Login failed:', error);
      }
    };

    
  return (
    <>
    <div className={styles.signIn}>
    <form className={styles.registerForm} onSubmit={handleSubmit(onSubmit)}>
        <h1>{t('auth.signIn.topic')}</h1>
        <div className={styles.inputForm}>
            <div className={styles.inputGroup}>
              <label>{t('auth.signIn.email')}</label>
              <input {...register("email", { 
                required: `${t('common.required')}`,
                pattern:{
                  value: /^[A-Z0-9._%+-]+@[a-z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: `${t('common.patternEmail')}`,
                },
              })} 
              placeholder={t('auth.signIn.placeholderEmail')} autoComplete="off"
              />
              <p>{errors.email?.message}</p>
            </div>
            <div className={styles.inputGroup}>
              <label>{t('auth.signIn.password')}</label>
              <input {...register("password", { 
                required: `${t('common.required')}`, 
                minLength:{ 
                  value: 6, 
                  message: `${t('auth.signIn.patternPassword')}`
                }
              })} 
              type={passwordShown ? "text" : "password"} placeholder={t('auth.signIn.placeholderPassword')}  autoComplete="off"/>
              <i className={styles.passwordShown} onClick={togglePasswordVisiblity}><img className={styles.backgroundGoals} src={showPassword} alt="Show password" /></i>
              <p>{errors.password?.message}</p>
            </div>
            {requires2FA && (
              <div className={styles.inputGroup}>
                <label>{t('auth.signIn.twoFACode')}</label>
                <input {...register("twoFACode", { 
                  required: `${t('common.required')}`,
                  minLength:{ 
                    value: 6, 
                    message: `${t('auth.signIn.patternCode')}`
                  }
                })} 
                placeholder={t('auth.signIn.twoFACode')} autoComplete="off"
                />
                <p>{errors.twoFACode?.message}</p>
              </div>
            )}
        </div>
        <a className={styles.forgotPassword} href="recovery">{t('auth.signIn.forgotPassword')}</a>
        
        {requires2FA ? (
          <button className={styles.signInButton} type="submit">
            {t('auth.signIn.verify2FA')}
          </button>
        ) : (
          <button className={styles.signInButton} type="submit">
            {t('auth.signIn.topic')}
          </button>
        )}
        
        <label className={styles.signUp} >{t('auth.signIn.textSignUp')} <Link to="/signUp">{t('auth.signIn.refSignUp')}</Link></label>
      </form>
    </div>

    </>

  );
}
