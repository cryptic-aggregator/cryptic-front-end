import React from 'react';
import Sidebar from '../../Sidebar/ProfileSidebar/ProfileSidebar';
import styles from "./ProfileLayout.module.css";
import { Outlet } from 'react-router-dom'; // Виводить дочірні маршрути
import Navbar from "../../../navigation/MainNavbar/MainNavbar";
import Footer from "../../Footer/Footer";

const ProfileLayout = () => {
  return (
    <main className={styles.main}>
      <Navbar/>
      <div className={styles.userProfile}>
        <div className={styles.userProfileContent}>

          <div className={styles.sideBar}> 
            <Sidebar/>
          </div>

          <div className={styles.userProfileInfo}> 
            <Outlet />
          </div>

        </div>
      </div>
      <Footer/>
    </main>
  );
};

export default ProfileLayout;
