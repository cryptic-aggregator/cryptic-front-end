import styles from "./Footer.module.css";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function Footer() {
    const {t} = useTranslation();
return (
    <>
        <footer>
            <div className={styles.footerContent}>
            <li className={styles.brand}>
                ©2024 Cryptic
            </li>
            <ul className={styles.footerUl}>
                <li>
                <Link to="/terms" >{t('navigation.footer.terms')}</Link>
                </li>
                <li>
                <Link to="/privacy">{t('navigation.footer.privacy')}</Link>
                </li>
            </ul>  
            </div> 
        </footer> 
    </>
);
}
