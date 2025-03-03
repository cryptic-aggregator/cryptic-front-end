import React from "react";
import styles from "../../components/styles/SettingsModal.module.css";
import { useState, useEffect } from "react";
import i18next from "i18next";
import { useTranslation } from 'react-i18next';
import {LANGUAGES} from "../../lib/i18n/constants.js";

export default function SettingsModal({ isOpen, onClose,children }) {
    const {t} = useTranslation();
    const [showLanguages, setShowLanguages] = useState(false);
    const [languageCode, setLanguageCode] = useState(`${i18next.language}`);

    // 🔹 Відслідковуємо зміну мови
    useEffect(() => {
        const handleLanguageChange = (lng) => {
            setLanguageCode(lng);
        };

        i18next.on("languageChanged", handleLanguageChange);

        return () => {
            i18next.off("languageChanged", handleLanguageChange);
        };
    }, []);

    const onModalClick = (event) => {
        // Закрити модалку, якщо клік був по врапперу
        if (event.target.classList.contains(styles.modalWrapper)) {
            onClose();
        }
    };



    return (
        <>
            {isOpen && (
                <div className={styles.modalWrapper} onClick={onModalClick}>
                    <div className={styles.settingsModal}>
                        <div className={styles.select} onClick={() => setShowLanguages(!showLanguages)}>
                            <span>{t('settingsModal.Language')}</span>
                            <div className={styles.current}>
                                <span>{LANGUAGES[languageCode].name}</span>
                                <img src={`https://flagsapi.com/${LANGUAGES[languageCode].codeImg}/flat/32.png`} alt={languageCode} />
                            </div>
                        </div>

                        <div className={`${styles.languageDropdown} ${showLanguages ? styles.open : ""}`}>
                        {Object.entries(LANGUAGES).map(([code, lang]) => (
                            <div
                                key={code}
                                className={styles.languageOption}
                                onClick={() => {
                                    i18next.changeLanguage(code); // Виправлено
                                    setShowLanguages(false);
                                }}
                            >
                                {lang.name}
                                <img
                                    src={`https://flagsapi.com/${lang.codeImg}/flat/32.png`}
                                    alt={lang.name}
                                />
                            </div>
                        ))}
                        </div>

                        <div className={styles.select}>
                            <span>{t('settingsModal.Currency')}</span>
                            <div className={styles.current}>
                                <span>UAH</span>
                                <img src="https://flagsapi.com/UA/flat/64.png" alt="UAH" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
