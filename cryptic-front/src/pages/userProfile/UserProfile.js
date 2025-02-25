import { useState } from "react";
import styles from "./UserProfile.module.css";
import Navbar from "../../components/Navbar.js";
import Footer from "../../components/Footer.js";
import Sidebar from "../../components/SideBarProfile.js";
import { useForm } from 'react-hook-form';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';


export default function UserProfile() {
  const {t} = useTranslation();
  const { register, handleSubmit, formState: {errors} } = useForm({mode: 'onChange',});

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
              <div className={styles.topic}>{t('userProfile.userProfile')}</div>
              <div className={styles.textTopic}>{t('userProfile.infomation')}</div>

              <form className={styles.registerForm} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.inputForm}>
                    <div className={styles.inputGroup}>
                      <label>{t('signUp.login')}</label>
                      <input {...register("login", { 
                        required: `${t('signUp.required')}` 
                      })} 
                      placeholder={t('signUp.placeholderLogin')} autoComplete="off"/>
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
              
          </div>
        </div>
   
      </div>
      <Footer/>
    </main>
    </>

  );
}
