import styles from "./styles/Navbar.module.css";
import logo from "../assets/images/NavBar/Logo.svg";
import settings from "../assets/images/NavBar/Settings.svg";
import { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../components/Modal/SettingsModal.js";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth"; // Глобальний стан авторизації

export default function Navbar() {
    const { t } = useTranslation();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const { isAuth, user } = useAuth(); // Отримуємо інформацію про користувача

    return (
        <>
            <nav className={styles.nav}>
                <Link to="/" className={styles.navTitle}>
                    <img className={styles.navLogo} src={logo} alt="Logo" />
                    Cryptic
                </Link>
                <ul className={styles.options}>
                        {isAuth ? (
                            <>
                                <li>
                                    <Link to="/dashboard">{t("navBar.portfolios")}</Link>
                                </li>
                                <li>
                                    <Link to="/none">{t("navBar.analytics")}</Link>
                                </li>
                                <li >
                                    <Link to="/none">{t("navBar.transfer")}</Link>
                                </li>
                            </>

                        ) : (
                            <>
                            </>
                        )}
                </ul>
                <div className={styles.navUl}>
                    <ul>
                        {isAuth ? (
                            // Якщо користувач авторизований, показуємо його ім'я
                            <li className={styles.user}>
                                <Link title={user.unique_name} to="/profile">
                                    {user?.unique_name.length > 8 ? user.unique_name.slice(0, 8) + "..." : user.unique_name}
                                </Link>
                            </li>
                        ) : (
                            // Якщо НЕ авторизований, показуємо кнопки входу та реєстрації
                            <>
                                <li className={styles.signIn}>
                                    <Link to="/signin">{t("navBar.signIn")}</Link>
                                </li>
                                <li className={styles.signUp}>
                                    <Link to="/signup">{t("navBar.signUp")}</Link>
                                </li>
                            </>
                        )}
                        <li className={styles.settings}>
                            <button onClick={() => setModalIsOpen(true)}>
                                <img src={settings} alt="Settings" />
                            </button>
                        </li>
                        <Modal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)}></Modal>
                    </ul>
                </div>
            </nav>
        </>
    );
}
