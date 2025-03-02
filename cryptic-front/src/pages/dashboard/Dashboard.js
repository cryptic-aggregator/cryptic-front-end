
import styles from "./Dashboard.module.css";
import Navbar from "../../components/Navbar.js";
import Footer from "../../components/Footer.js";
import Sidebar from "../../components/SideBarPortfolios.js";
import NavbarOptions from "../../components/NavbarOptions.js";
import currencyImg from "../../assets/images/Dashboard/currencyImg.svg";
import openIcon from "../../assets/images/Dashboard/openIcon.svg";
import syncIcon from "../../assets/images/Dashboard/syncIcon.svg";
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const {t} = useTranslation();

  return (
    <>
    <main className={styles.main}>
      <Navbar/>
      <div className={styles.userDashboard}>
    
        <div className={styles.userDashboardContent}>
          <div className={styles.sideBar}> 
            <Sidebar/>
          </div>
          <div className={styles.userDashboardInfo}> 
            <NavbarOptions/>
            <div className={styles.сompressedInfo}>
              <div className={styles.сompressedInfoText}>
                  <span>Total Worth</span>
                  <div className={styles.balance}>
                    <span>20.31</span>
                    <img className={styles.currencyImg} src={currencyImg} alt="Current Currency" />
                    <span>USDT<button><img className={styles.openIcon} src={openIcon} alt="Open Currency" /></button></span>
                  </div>
                  <div className={styles.balanceChange}>
                    <span>-19.1 USDT / 25.67%  </span>
                    <span>24H<button><img className={styles.openIcon} src={openIcon} alt="Open Currency" /></button></span>
                  </div>
              </div>
              <div className={styles.сompressedInfoGraph}>

              </div>
              <div className={styles.suncAll}>
                <img className={styles.syncIcon} src={syncIcon} alt="Current Currency" />
                <button>Sync All</button>
              </div>

            </div>
            <div className={styles.historyInfo}>
                <div>
                  <span>Assets<span>$21.9</span></span>
                </div>
                <table>
                  <span>Assets<span>$21.9</span></span>
                </table>
              
            </div>
          </div>
        </div>
   
      </div>
      <Footer/>
    </main>
    </>

  );
}
