import styles from "./styles/SideBarProfile.module.css";

import { useState, useEffect } from "react";
import { Link,useLocation,useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import userImg from "../assets/images/SideBar/user.jpg";
import iconUserImg from "../assets/images/SideBar/iconUserImg.svg";
import FAIcon from "../assets/images/SideBar/2FAIcon.svg";
import changePasswordIcon from "../assets/images/SideBar/changePasswordIcon.svg";
import userProfileIcon from "../assets/images/SideBar/userProfileIcon.svg";
import { useAuth } from "../hooks/useAuth"; // Глобальний стан авторизації
import { authApi } from '../api/endpoints/authApi';

export default function SideBarProfile() {

    const {t} = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuth, user } = useAuth(); // Отримуємо інформацію про користувача
    // Якщо користувач не авторизований, редирект на сторінку входу
    
    useEffect(() => {
        if (!isAuth) {
            navigate("/signin");
        }
    }, [isAuth, navigate]);

    const logout = async () => {
      try {
        authApi.logout();
        console.log('Logout successful:');
        navigate('/');

      } catch (error) {
        console.error('Logout failed:', error);
      }
    };
    if (!isAuth) {
        return null;  // Якщо не авторизований, нічого не відображається
    }
    return (
        <>
            <aside className={styles.sidebar}>
                <div className={styles.userInfo}>
                    <div className={styles.userImg}>
                      <img className={styles.userPhoto} src={userImg} alt="User Photo" />
                      <div className={styles.photoIcon} >
                        <img src={iconUserImg} alt="Icon" />
                      </div>
                    </div>
                    <div className={styles.title1}>
                        {user.unique_name}
                    </div>
                    <div className={styles.title2}>
                        {user.email}
                    </div>
                </div>
                <div className={styles.userManagement}>
                    <div className={styles.userManagementUl}>
                        <Link to="/profile" className={`${location.pathname === "/profile" ? styles.active : ""} ${styles.userManagementList}`}>
                            <div>
                                <img className={styles.managementIcon} src={userProfileIcon} alt="Icon" />
                                <span>{t('sideBarProfile.userProfile')}</span>
                            </div>
                        </Link>
                        <Link  to="/twoAuthenticator" className={`${location.pathname === "/twoAuthenticator" || location.pathname === "/twoAuthenticatorDisable" ? styles.active : ""} ${styles.userManagementList}`}>
                            <div>
                                <img className={styles.managementIcon} src={FAIcon} alt="Icon" />
                                <span>{t('sideBarProfile.authenticator')}</span>
                            </div>                            
                        </Link>
                        <Link to="/changePassword" className={`${location.pathname === "/changePassword" ? styles.active : ""} ${styles.userManagementList}`}>
                            <div>
                                <img className={styles.managementIcon} src={changePasswordIcon} alt="Icon" />
                                <span>{t('sideBarProfile.changePassword')}</span>
                            </div>                            
                        </Link>
                        {isAuth ? (
                            // Якщо користувач авторизований, показуємо його ім'я
                            <button onClick={logout} className={styles.logout}>
                                Logout
                            </button>
                        ) : (
                            <>
                            </>
                        )}
                    </div>
                    <button className={styles.deleteProfile}>{t('sideBarProfile.deleteProfile')}</button>
                </div>

            </aside>
        </>
    );
}
