import styles from "./styles/SideBarProfile.module.css";

import { useState, useEffect } from "react";
import { Link,useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import userImg from "../assets/images/SideBar/user.jpg";
import iconUserImg from "../assets/images/SideBar/iconUserImg.svg";
import FAIcon from "../assets/images/SideBar/2FAIcon.svg";
import changePasswordIcon from "../assets/images/SideBar/changePasswordIcon.svg";
import userProfileIcon from "../assets/images/SideBar/userProfileIcon.svg";
export default function SideBarProfile() {

    const {t} = useTranslation();
    const location = useLocation();
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
                        Username
                    </div>
                    <div className={styles.title2}>
                        useremail@gmail.com
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
                    </div>
                    <button className={styles.deleteProfile}>{t('sideBarProfile.deleteProfile')}</button>
                </div>

            </aside>
        </>
    );
}
