import styles from "./styles/Navbar.module.css";
import logo from "../assets/images/NavBar/Logo.svg";
import settings from "../assets/images/NavBar/Settings.svg";
import { useState, useEffect } from "react";


export default function Navbar() {

    return (
        <>
            <nav className={styles.nav}>
                <button className={styles.navTitle}>
                    <img className={styles.navLogo} src={logo} alt="Logo" />
                    Cryptic
                </button>
                <div className={styles.navUl}>
                    <ul>
                        <li className={styles.signIn}>
                            <button href="/signin">Log In</button>
                        </li>
                        <li className={styles.signUp}>
                            <button href="/signup">Get Started</button>
                        </li>
                        <li className={styles.settings}>
                            <button ><img src={settings} alt="Settings" /></button>
                        </li>
                    </ul>
                </div>

            </nav>
        </>
    );
}
