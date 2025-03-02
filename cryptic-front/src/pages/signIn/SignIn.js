import { useState } from "react";
import { useForm } from 'react-hook-form';
import showPassword from "../../assets/images/SignUpPage/eyeOff.svg";
import styles from "./SignIn.module.css";
import { Link,useNavigate  } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { authApi } from '../../api/endpoints/authApi';

export default function SignIn() {
    const {t} = useTranslation();
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
        const response = await authApi.login(userData);
        navigate('/portfolio/dashboard');
        console.log('Login successful:', response.data);
      } catch (error) {
        // Можна додати Toast повідомлення про помилку
        console.error('Login failed:', error.response?.data);
      }
    };

  return (
    <>
    <div className={styles.signIn}>
    <form className={styles.registerForm} onSubmit={handleSubmit(onSubmit)}>
        <h1>{t('signIn.topic')}</h1>
        <div className={styles.inputForm}>

            <div className={styles.inputGroup}>
              <label>{t('signIn.email')}</label>
              <input {...register("email", { 
                required: `${t('signIn.required')}`,
              })} 
              placeholder={t('signIn.placeholderEmail')} autoComplete="off"
              />
              <p>{errors.email?.message}</p>
            </div>
            <div className={styles.inputGroup}>
              <label>{t('signIn.password')}</label>
              <input {...register("password", { 
                required: `${t('signIn.required')}`, 

              })} 
              type={passwordShown ? "text" : "password"} placeholder={t('signIn.placeholderPassword')}  autoComplete="off"/>
              <i className={styles.passwordShown} onClick={togglePasswordVisiblity}><img className={styles.backgroundGoals} src={showPassword} alt="Show password" /></i>
              <p>{errors.password?.message}</p>
            </div>
        </div>
        <a className={styles.forgotPassword} href="recovery">{t('signIn.forgotPassword')}</a>
        <button className={styles.signInButton} type="submit" >{t('signIn.topic')}</button>
        <label className={styles.signUp} >{t('signIn.textSignUp')} <Link to="/signUp">{t('signIn.refSignUp')}</Link></label>
      </form>
    </div>
    </>

  );
}
