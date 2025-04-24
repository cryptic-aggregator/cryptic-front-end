import styles from "./ProfileSidebar.module.css";

import { useState, useEffect } from "react";
import { Link,useLocation,useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import userImg from "../../../../assets/images/SideBar/user.jpg";
import iconUserImg from "../../../../assets/images/SideBar/iconUserImg.svg";
import FAIcon from "../../../../assets/images/SideBar/2FAIcon.svg";
import changePasswordIcon from "../../../../assets/images/SideBar/changePasswordIcon.svg";
import userProfileIcon from "../../../../assets/images/SideBar/userProfileIcon.svg";
import { useAuth } from "../../../../hooks/useAuth"; 
import { useUser } from "../../../../hooks/useUser"; 
import { logoutUser } from "../../../../store/actions/authActions";
import { useDispatch } from "react-redux";

export default function ProfileSidebar() {

    const {t} = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuth } = useAuth(); // Отримуємо інформацію про користувача 
    const { user, isLoading, error } = useUser(); // Отримуємо інформацію про користувача

    useEffect(() => {
        if (!isAuth) {
            navigate("/signin");
        }
    }, [isAuth, navigate]);

    const logout = async () => {
      try {
        dispatch(logoutUser()); 
        console.log('Logout successful:');
        navigate('/');

      } catch (error) {
        console.error('Logout failed:', error);
      }
    };

    return (
        <>

            <aside className={styles.sidebar}>
                <div className={styles.userInfo}>

                    {isLoading && 
                    <div className={styles.portfolioContentLoader}>
                         <Loader />
                    </div>
                    }
                    {error && 
                    <div className={styles.portfolioContentLoader}>
                         <Error />
                    </div>
                    }
                    {!error && !isLoading && user!=null &&
                    <>
                    <div className={styles.userImg}>
                      <img className={styles.userPhoto} src={userImg} alt="User Photo" />
                      <div className={styles.photoIcon} >
                        <img src={iconUserImg} alt="Icon" />
                      </div>
                    </div>
                    <div className={styles.title1}>
                        {user.name}
                    </div>
                    <div className={styles.title2}>
                        {user.email}
                    </div>
                    </>
                    }
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
