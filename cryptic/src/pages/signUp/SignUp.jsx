import { useState } from "react";
import { useForm } from 'react-hook-form';
import showPassword from "../../assets/images/SignUp/eyeOff.svg";
import styles from "./SignUp.module.css";
import { Link,useNavigate  } from "react-router-dom";
import { authApi } from '../../api/endpoints/authApi';
import { useTranslation } from 'react-i18next';
import React from 'react';
import toast, { Toaster } from 'react-hot-toast';


export default function SignUp() {
    const {t} = useTranslation();
    const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  
    //show password
    const [passwordShown, setPasswordShown] = useState(false);
    const [passwordConfirmShown, setPasswordConfirmShown] = useState(false);
    let password;
    
    const togglePasswordVisiblity = () => {
      setPasswordShown(passwordShown ? false : true);
    };
    const togglePasswordConfirmVisiblity = () => {
      setPasswordConfirmShown(passwordConfirmShown ? false : true);
    };
  
    const { register, handleSubmit, watch, formState: {errors} } = useForm({mode: 'onChange',});
    password = watch("password", "");

    const onSubmit = async (data) => {
      try {
        const userData = {
          name: data.login, // Змінено з login на name відповідно до API
          email: data.email,
          password: data.password
        };
        const response = await authApi.register(userData);
        navigate('/signIn');
        console.log('Registration successful',);
      } catch (error) {
        toast.error(t('auth.signIn.failedSignUp'));
        console.error('Registration failed:', error.response?.data);
      }
    };

  return (
    <>
    <div className={styles.signUp}>
    <form className={styles.registerForm} onSubmit={handleSubmit(onSubmit)}>
        <h1>{t('auth.signUp.topic')}</h1>
        <div className={styles.inputForm}>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>{t('auth.signUp.login')}</label>
              <input {...register("login", { 
                required: `${t('common.required')}` 
              })} 
              placeholder={t('auth.signUp.placeholderLogin')} autoComplete="off"/>
              <p>{errors.login?.message}</p>
            </div>
            <div className={styles.inputGroup}>
              <label>{t('auth.signUp.email')}</label>
              <input {...register("email", { 
                required: `${t('common.required')}`, 
                pattern:{
                  value: /^[A-Z0-9._%+-]+@[a-z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: `${t('common.patternEmail')}`,
                },
              })} 
              placeholder={t('auth.signUp.placeholderEmail')} autoComplete="off"
              />
              <p>{errors.email?.message}</p>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>{t('auth.signUp.password')}</label>
              <input {...register("password", { 
                required: `${t('common.required')}`, 
                minLength:{ 
                  value: 6, 
                  message: `${t('auth.signUp.patternPassword')}`
                }
              })} 
              type={passwordShown ? "text" : "password"} placeholder={t('auth.signUp.placeholderPassword')} autoComplete="off"/>
              <i className={styles.passwordShown} onClick={togglePasswordVisiblity}><img className={styles.backgroundGoals} src={showPassword} alt="Show password" /></i>
              <p>{errors.password?.message}</p>
            </div>
            <div className={styles.inputGroup}>
              <label>{t('auth.signUp.confirmPassword')}</label>
              <input {...register("confirmPassword", { 
                required: `${t('common.required')}`,
                validate: (value) => value === password || `${t('auth.signUp.patternConfirmPassword')}`
                }
              )} 
              type={passwordConfirmShown ? "text" : "password"}placeholder={t('auth.signUp.placeholderConfirmPassword')} autoComplete="off"/>
              <i className={styles.passwordConfirmShown} onClick={togglePasswordConfirmVisiblity}><img className={styles.backgroundGoals} src={showPassword} alt="Show password" /></i>
              <p>{errors.confirmPassword?.message}</p>
            </div>
          </div>
        </div>

        <div className={styles.checkboxTerms}>
          <input id="check" type="checkbox" {...register("agreeUseTerms", { 
            required: `${t('common.required')}` 
          })}/>
          <label htmlFor="check">{t('auth.signUp.check')}</label>
        </div>
        <p>{errors.agreeUseTerms?.message}</p>

        <button className={styles.signUpButton} type="submit" >{t('auth.signUp.button')}</button>
        <label className={styles.signIn} >{t('auth.signUp.textSignIn')}<Link to="/signIn">{t('auth.signUp.refSignIn')}</Link></label>
      </form>
    </div>
    </>

  );
}
