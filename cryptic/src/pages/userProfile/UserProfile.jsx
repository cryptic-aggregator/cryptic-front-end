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

  return (
    <>

              <div className={styles.topic}>{t('profile.title')}</div>
              <div className={styles.textTopic}>{t('profile.info')}</div>

              <form className={styles.registerForm} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.inputForm}>
                    <div className={styles.inputGroup}>
                      <label>{t('profile.login')}</label>
                      <input {...register("login", { 
                        required: `${t('common.required')}` 
                      })} 
                      placeholder={t('profile.placeholderLogin')}
                      autoComplete="off"/>
                      <p>{errors.login?.message}</p>
                    </div>
                    <div className={styles.inputGroup}>
                      <label>{t('profile.email')}</label>
                      <input {...register("email", { 
                        required: `${t('common.required')}`,
                      })} 
                      placeholder={t('profile.placeholderEmail')} autoComplete="off"
                      />
                      <p>{errors.email?.message}</p>
                    </div>
                </div>
                <div className={styles.buttonWrapper}>
                  <button className={styles.button} type="submit">{t('profile.update')}</button>
              </div>
              </form>

    </>

  );
}
