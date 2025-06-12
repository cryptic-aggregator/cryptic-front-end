import styles from "./Portfolios.module.css";
import { Link, useLocation, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useContainerWidth } from "../../../../hooks/useContainerWidth";

export default function PortfoliosNavbar() {
    const { t } = useTranslation();
    const location = useLocation();
    const { id } = useParams();
    
    const isActiveDashboard = location.pathname.startsWith("/dashboard");
    const isActiveAnalytics = location.pathname.startsWith("/analytics");
    const isActiveTransactions = location.pathname.startsWith("/transactions");
    const isActiveWallets = location.pathname.startsWith("/wallets");
    const { ref, widthsState } = useContainerWidth([535]);
  
    const generateLink = (basePath) => id ? `${basePath}/${id}` : basePath;

    return (
        <nav ref={ref} className={`${styles.nav} ${widthsState[535] ? styles.narrowNav : ''}`}>
            <Link to={generateLink("/dashboard")} className={`${isActiveDashboard ? styles.active : ""} ${styles.option}`}>
                <span>{t('navigation.portfolios.dashboard')}</span>
            </Link>
            <Link to={generateLink("/analytics")} className={`${isActiveAnalytics ? styles.active : ""} ${styles.option}`}>
                <span>{t('navigation.portfolios.analytics')}</span>
            </Link>
            <Link to={generateLink("/transactions")} className={`${isActiveTransactions ? styles.active : ""} ${styles.option}`}>
                <span>{t('navigation.portfolios.transactions')}</span>
            </Link>
            <Link to={generateLink("/wallets")} className={`${isActiveWallets ? styles.active : ""} ${styles.option}`}>
                <span>{t('navigation.portfolios.wallets')}</span>
            </Link>
        </nav>
    );
}
