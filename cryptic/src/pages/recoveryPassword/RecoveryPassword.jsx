import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import showPassword from "../../assets/images/SignUpPage/eyeOff.svg";
import styles from "./RecoveryPassword.module.css";
import { Link,useNavigate  } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useDispatch } from "react-redux";
import { useUser } from "../../hooks/useUser"; 
import { sendRecoveryCode, resetPassword } from "../../store/slices/userSlice";

export default function SignIn() {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const [openReset, setOpenReset] = useState(false);
    const [email, setEmail] = useState(null);
      //show password
    const [passwordShown, setPasswordShown] = useState(false);
    const [passwordConfirmShown, setPasswordConfirmShown] = useState(false);
    let password;
    const [timer, setTimer] = useState(0);
    const navigate = useNavigate();
    const { messageRecoveryPassword } = useUser(); // Отримуємо інформацію про користувача
    const togglePasswordVisiblity = () => {
      setPasswordShown(passwordShown ? false : true);
    };
    const togglePasswordConfirmVisiblity = () => {
      setPasswordConfirmShown(passwordConfirmShown ? false : true);
    };
    useEffect(() => {
      if (timer > 0) {
        const countdown = setInterval(() => {
          setTimer(prev => prev - 1);
        }, 1000);
    
        return () => clearInterval(countdown);
      }
    }, [timer])

    const { register, handleSubmit, watch, formState: {errors} } = useForm({mode: 'onChange',});
    password = watch("newPassword", "");
    const onSubmitEmail = async (data) => {
      try {
        await dispatch(sendRecoveryCode({
          email: data.email
          })).unwrap();
        setEmail(data.email) 
        setOpenReset(true)
        setTimer(60);
      } catch (error) {
        console.error('Sent code failed:', error);
      }
    };

    const onSubmitPassword = async (data) => {
      try {
        await dispatch(resetPassword({
          email: email,
          code: data.code,
          newPassword: data.newPassword
        })).unwrap();
        navigate("/signin");
      } catch (error) {
        console.error('Reset password failed:', error);
      }
    };
    const sendCode = async () =>{
      try {
        await dispatch(sendRecoveryCode({
          email: email
          })).unwrap();
        setTimer(60);
      } catch (error) {
        console.error('Sent code failed:', error);
      }
    }
  return (
    <>

    <div className={styles.signIn}>
      { !openReset ? (
        <form className={styles.registerForm} onSubmit={handleSubmit(onSubmitEmail)}>
          <h1>Reset Password</h1>
          <div className={styles.inputForm}>

              <div className={styles.inputGroup}>
                <label>{t('signIn.email')}</label>
                <input {...register("email", { 
                  required: `${t('signIn.required')}`,
                  pattern:{
                    value: /^[A-Z0-9._%+-]+@[a-z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: `${t('signUp.patternEmail')}`,
                  },
                })} 
                placeholder={t('signIn.placeholderEmail')} autoComplete="off"
                />
                <p>{errors.email?.message}</p>
              </div>
          </div>
          <button className={styles.signInButton} type="submit" >Send code</button>
          <label className={styles.resent} >I already remembered the password :) <Link to="/signIn">{t('signUp.refSignIn')}</Link></label>

        </form>
      ) :(
        <form className={styles.registerForm} onSubmit={handleSubmit(onSubmitPassword)}>
          <h1>Reset Password</h1>
          <div className={styles.infoCode} >A password recovery code has been sent to the email address provided.</div>
          {messageRecoveryPassword && (
            <div className={styles.errorMessage}>{messageRecoveryPassword}</div>
          )}
          <div className={styles.inputForm}>

              <div className={styles.inputGroup}>
                <label>Recovery Code</label>
                <input {...register("code", { 
                  required: `${t('signIn.required')}`,
                  minLength:{ 
                    value: 6, 
                    message: `${t('signUp.patternPassword')}`
                  }
                })} 
                placeholder={t('Recovery Code')} autoComplete="off"
                />
                <p>{errors.code?.message}</p>
              </div>

              <div className={styles.inputGroup}>
                <label>New Password</label>
                <input {...register("newPassword", { 
                  required: `${t('signUp.required')}`, 
                  minLength:{ 
                    value: 6, 
                    message: `${t('signUp.patternPassword')}`
                  }
                })} 
                type={passwordShown ? "text" : "password"} placeholder={t('signUp.placeholderPassword')} autoComplete="new-password"/>
                <i className={styles.passwordShown} onClick={togglePasswordVisiblity}><img className={styles.backgroundGoals} src={showPassword} alt="Show password" /></i>
                <p>{errors.newPassword?.message}</p>
              </div>

              <div className={styles.inputGroup}>
                <label>{t('signUp.confirmPassword')}</label>
                <input {...register("confirmPassword", { 
                  required: `${t('signUp.required')}`,
                  validate: (value) => value === password || `${t('signUp.patternConfirmPassword')}`
                  }
                )} 
                type={passwordConfirmShown ? "text" : "password"}placeholder={t('signUp.placeholderConfirmPassword')} autoComplete="new-password"/>
                <i className={styles.passwordConfirmShown} onClick={togglePasswordConfirmVisiblity}><img className={styles.backgroundGoals} src={showPassword} alt="Show password" /></i>
                <p>{errors.confirmPassword?.message}</p>
              </div>

          </div>
          <label className={styles.resent}>
            Didn't receive a code?{" "}
            <button onClick={sendCode} disabled={timer > 0}>
              Send Again
            </button>
            {timer > 0 && ` in ${timer}s`}
          </label>
          
        <button className={styles.signInButton} type="submit" >Save</button>

          <label className={styles.resent} >I already remembered the password :) <Link to="/signIn">{t('signUp.refSignIn')}</Link></label>
        </form>
      )

      }

    </div>
    </>

  );
}
