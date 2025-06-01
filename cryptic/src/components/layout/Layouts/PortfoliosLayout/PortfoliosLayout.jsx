import React, { useEffect, useState } from 'react';
import Sidebar from '../../Sidebar/PortfoliosSidebar/PortfoliosSidebar';
import styles from "./PortfoliosLayout.module.css";
import { Outlet } from 'react-router-dom'; // Виводить дочірні маршрути
import Navbar from "../../../navigation/MainNavbar/MainNavbar";
import Footer from "../../Footer/Footer";
import NavbarOptions from "../../../navigation/PortfoliosNavbar/PortfoliosNavbar";
import openBar from "../../../../assets/images/SideBarPortfolios/openBar.svg";
import { useContainerWidth } from '../../../../hooks/useContainerWidth';
const PortfoliosLayout = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const storedValue = localStorage.getItem("isSidebarOpen");
    return storedValue === null ? true : JSON.parse(storedValue);
  });
  useEffect(() => {
    localStorage.setItem("isSidebarOpen", JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  return (
    <main className={styles.main}>
      {isSidebarOpen && <div className={styles.backdrop} onClick={() => setIsSidebarOpen(!isSidebarOpen)} />}
      <Navbar/>
      <div className={styles.contentWrapper}>
        <div className={styles.content}>

          <button  onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`${isSidebarOpen  ? styles.hiddenButton : ""} ${styles.openSidebar}`}> 
              <img  title={'edit'} src={openBar} alt="Icon" />
              <span className={styles.spanButton}>Porfolios</span>
          </button>
          <div  className={`${!isSidebarOpen  ? styles.hiddenSideBar : ""} ${styles.sideBar}`}> 
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}/>
          </div>
          <div className={`${!isSidebarOpen  ? styles.fullScreen : ""} ${styles.pageInfo}`} > 
            <NavbarOptions/>
            <Outlet  />
          </div>

        </div>
      </div>
      <Footer/>
    </main>
  );
};

export default PortfoliosLayout;
