import styles from "./Main.module.css";
import logo from "../../../../assets/images/NavBar/Logo.svg";
import settings from "../../../../assets/images/NavBar/Settings.svg";
import menu from "../../../../assets/images/NavBar/Menu.svg";
import React, { useState, useRef,useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "../../../modals/Settings/Settings";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../../hooks/useAuth"; // Глобальний стан авторизації
import { useUser } from "../../../../hooks/useUser"; // Глобальний стан авторизації

const LazyModal = React.lazy(() => import("../../../modals/Settings/Settings"));

export default function MainNavbar() {


    const { t } = useTranslation();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isOpenMenu, setOpenMenu] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current && 
                !menuRef.current.contains(event.target)
            ) {
                setOpenMenu(false);
            }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const { isAuth} = useAuth();
    const { user } = useUser(); // Отримуємо інформацію про користувача

    return (
        <>
            <nav className={styles.nav}>
                {isAuth ? (
                    <>
                        <button onClick={() => setOpenMenu(!isOpenMenu)}><img className={styles.sideMenuButton} src={menu} alt="Menu" /></button>
                        <ul ref={menuRef} className={`${isOpenMenu ? styles.active : ""} ${styles.sideMenu}`}>
                            <li className={styles.select}>
                                <Link to="/dashboard">{t("navigation.main.portfolios")}</Link>
                            </li>
                            <li className={styles.select}>
                                <Link to="/analytics">{t("navigation.main.analytics")}</Link>
                            </li>
                            <li className={styles.select}>
                                <Link to="/transfer">{t("navigation.main.transfer")}</Link>
                            </li>
                        </ul>
                    </>

                ) : (
                    <>
                    </>
                )}


                
                <Link to="/" className={styles.navTitle}>
                    <img className={styles.navLogo} src={logo} alt="Logo" />
                    Cryptic
                </Link>
                <ul className={styles.options}>
                        {isAuth ? (
                            <>
                                <li>
                                    <Link to="/dashboard">{t("navigation.main.portfolios")}</Link>
                                </li>
                                <li>
                                    <Link to="/analytics">{t("navigation.main.analytics")}</Link>
                                </li>
                                <li >
                                    <Link to="/transfer">{t("navigation.main.transfer")}</Link>
                                </li>
                            </>

                        ) : (
                            <>
                            </>
                        )}
                </ul>
                <div className={styles.navUl}>
                    <ul>
                        {isAuth && user ? (
                            // Якщо користувач авторизований, показуємо його ім'я
                            <li className={user?.name.length > 8 ? `${styles.user} ${styles.truncated}` : styles.user}>
                            <Link title={user.name} to="/profile">
                                {user?.name.length > 8 ? user.name.slice(0, 8) : user.name}
                            </Link>
                            </li>
                        ) : (
                            // Якщо НЕ авторизований, показуємо кнопки входу та реєстрації
                            <>
                                <li className={styles.signIn}>
                                    <Link to="/signin">{t("navigation.auth.signIn")}</Link>
                                </li>
                                <li className={styles.signUp}>
                                    <Link to="/signup">{t("navigation.auth.signUp")}</Link>
                                </li>
                            </>
                        )}
                        <li className={styles.settings}>
                            <button onClick={() => setModalIsOpen(true)}>
                                <img src={settings} alt="Settings" />
                            </button>
                        </li>
                        <LazyModal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)}></LazyModal>
                    </ul>
                </div>
            </nav>
        </>
    );
}
