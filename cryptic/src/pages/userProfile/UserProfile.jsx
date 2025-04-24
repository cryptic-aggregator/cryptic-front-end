import { useEffect } from "react";
import styles from "./UserProfile.module.css";

import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useAuth } from "../../hooks/useAuth";
import { useUser } from "../../hooks/useUser"; 
import { fetchUser, updateUser } from "../../store/slices/userSlice";
import { useDispatch } from "react-redux";

export default function UserProfile() {
  const {t} = useTranslation();
  const { isAuth } = useAuth(); // Отримуємо інформацію про користувача 
  const { user } = useUser(); // Отримуємо інформацію про користувача
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: {errors} } = useForm({
    mode: 'onChange',
    defaultValues: {
      login: user?.name, 
      email: user?.email
    }
  });

  const onSubmit = (data) => {
    console.log(data);
    dispatch(updateUser({
      name: data.login,
      email: data.email
    }));
  };
   useEffect(() => {
     if (!isAuth) {
       navigate("/signin"); // Якщо не авторизований, перенаправляємо на сторінку входу
     }
   }, [isAuth, navigate]);

  return (
    <>

              <div className={styles.topic}>{t('userProfile.userProfile')}</div>
              <div className={styles.textTopic}>{t('userProfile.infomation')}</div>

              <form className={styles.registerForm} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.inputForm}>
                    <div className={styles.inputGroup}>
                      <label>{t('signUp.login')}</label>
                      <input {...register("login", { 
                        required: `${t('signUp.required')}` 
                      })} 
                      placeholder={t('signUp.placeholderLogin')}
                      autoComplete="off"/>
                      <p>{errors.login?.message}</p>
                    </div>
                    <div className={styles.inputGroup}>
                      <label>{t('signUp.email')}</label>
                      <input {...register("email", { 
                        required: `${t('signUp.required')}`,
                      })} 
                      placeholder={t('signUp.placeholderEmail')} autoComplete="off"
                      />
                      <p>{errors.email?.message}</p>
                    </div>
                </div>
                <div className={styles.buttonWrapper}>
                  <button className={styles.button} type="submit">{t('userProfile.updateProfile')}</button>
              </div>
              </form>

    </>

  );
}
