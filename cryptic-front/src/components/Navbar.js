import styles from "./styles/Navbar.module.css";
import logo from "../assets/images/NavBar/Logo.svg";
import settings from "../assets/images/NavBar/Settings.svg";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "../components/Modal/SettingsModal.js";
import { useTranslation } from 'react-i18next';

export default function Navbar() {
    const {t} = useTranslation();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    return (
        <>
            <nav className={styles.nav}>
                <Link to="/" className={styles.navTitle}>
                    <img className={styles.navLogo} src={logo} alt="Logo" />
                    Cryptic
                </Link>
                <div className={styles.navUl}>
                    <ul>
                        <li className={styles.signIn}>
                            <Link to="/signin">{t('navBar.signIn')}</Link>
                        </li>
                        <li className={styles.signUp}>
                            <Link to="/signup">{t('navBar.signUp')}</Link>
                        </li>
                        <li className={styles.settings}>
                            <button onClick={() => setModalIsOpen(true)}><img src={settings} alt="Settings" /></button>
                        </li>
                        <Modal isOpen ={modalIsOpen} onClose={ () => setModalIsOpen(false)}>
                            <Link to="/signin" className={styles.auth}>
                                <span>{t('navBar.signIn')}</span>
                            </Link>
                            <Link to="/signup" className={styles.auth}>
                                <span>{t('navBar.signUp')}</span>
                            </Link>
                        </Modal>
                    </ul>
                </div>

            </nav>
        </>
    );
}
