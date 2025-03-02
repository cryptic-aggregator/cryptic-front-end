import styles from "./styles/SideBarPortfolios.module.css";

import { Link,useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import closeBar from "../assets/images/SideBarPortfolios/closeBar.svg";

export default function SideBarPortfolios() {
    const namePortfolios = [
      "Cummming","Cout","Lodygh","Cummming","Sicket","Westing","Xolen",
    ]
        
    
    const {t} = useTranslation();
    const location = useLocation();
    return (
        <>
<aside className={styles.sidebar}>
    <div className={styles.sidebarInfo}>
        <div className={styles.topicContentWrapper}>
            <div className={styles.topicContent}>
                <div className={styles.topic}>All Portfolios</div>
                <img className={styles.closeBar} src={closeBar} alt="Icon" />
            </div>
        </div>
        <div className={styles.userPortfoliosList}>
            {Array.isArray(namePortfolios) && namePortfolios.length > 0 ? (
                namePortfolios.map((namePortfolio) => (
                    <Link 
                        key={namePortfolio}
                        to={`${namePortfolio}`} 
                        className={`${location.pathname === `/portfolio/${namePortfolio}` ? styles.active : ""} ${styles.userPortfolio}`}
                    >
                        <div>
                            <span>{namePortfolio}</span>
                        </div>
                    </Link>
                ))
            ): (<>
                    <span className={styles.emptyMessage}>You don't have a portfolio yet, but you can easily create one</span>
                    <Link to="/portfolioCreate" className={styles.createPortfolioEmpty}>Create Portfolio Now</Link>
                </>
            )}
        </div>
    </div>
    <div className={styles.createPortfoliotWrapper}>
        <Link to="/portfolioCreate" className={styles.createPortfolio}>Create Portfolio</Link>
    </div>            
</aside>


        </>
    );
}
