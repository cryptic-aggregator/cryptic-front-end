import styles from "./styles/NavbarOptions.module.css";
import logo from "../assets/images/NavBar/Logo.svg";
import settings from "../assets/images/NavBar/Settings.svg";
import { useState, useEffect } from "react";
import { Link,useLocation } from "react-router-dom";
import Modal from "./Modal/SettingsModal.js";
import { useTranslation } from 'react-i18next';

export default function NavbarOptions() {
    const {t} = useTranslation();
    const location = useLocation();
    return (
        <>
            <nav className={styles.nav}>
                <Link to="/portfolio/dashboard" className={`${location.pathname === '/portfolio/dashboard' ? styles.active : ""} ${styles.option}`}>
                    <span>Dashboard</span>
                </Link>
                <Link to="/portfolio/analytics" className={`${location.pathname === '/portfolio/analytics' ? styles.active : ""} ${styles.option}`}>
                    <span>Analytics</span>
                </Link>
                <Link to="/portfolio/transactions" className={`${location.pathname === '/portfolio/transactions' ? styles.active : ""} ${styles.option}`}>
                    <span>Transactions</span>
                </Link>
                <Link to="/portfolio/wallets" className={`${location.pathname === '/portfolio/wallets' ? styles.active : ""} ${styles.option}`}>
                    <span>Wallets</span>
                </Link>
            </nav>
        </>
    );
}
