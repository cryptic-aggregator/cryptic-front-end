import styles from "./PortfoliosNavbar.module.css";
import { Link, useLocation, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function PortfoliosNavbar() {
    const { t } = useTranslation();
    const location = useLocation();
    const { id } = useParams();
    
    const isActiveDashboard = location.pathname.startsWith("/dashboard");
    const isActiveAnalytics = location.pathname.startsWith("/analytics");
    const isActiveTransactions = location.pathname.startsWith("/transactions");
    const isActiveWallets = location.pathname.startsWith("/wallets");

    const generateLink = (basePath) => id ? `${basePath}/${id}` : basePath;

    return (
        <nav className={styles.nav}>
            <Link to={generateLink("/dashboard")} className={`${isActiveDashboard ? styles.active : ""} ${styles.option}`}>
                <span>Dashboard</span>
            </Link>
            <Link to={generateLink("/analytics")} className={`${isActiveAnalytics ? styles.active : ""} ${styles.option}`}>
                <span>Analytics</span>
            </Link>
            <Link to={generateLink("/transactions")} className={`${isActiveTransactions ? styles.active : ""} ${styles.option}`}>
                <span>Transactions</span>
            </Link>
            <Link to={generateLink("/wallets")} className={`${isActiveWallets ? styles.active : ""} ${styles.option}`}>
                <span>Wallets</span>
            </Link>
        </nav>
    );
}
