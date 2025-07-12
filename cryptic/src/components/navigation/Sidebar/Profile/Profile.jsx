import styles from "./Profile.module.css";

import { useState, useEffect, useRef } from "react";
import { Link,useLocation,useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import userImg from "../../../../assets/images/SideBar/user.jpg";
import iconUserImg from "../../../../assets/images/SideBar/iconUserImg.svg";
import FAIcon from "../../../../assets/images/SideBar/2FAIcon.svg";
import changePasswordIcon from "../../../../assets/images/SideBar/changePasswordIcon.svg";
import userProfileIcon from "../../../../assets/images/SideBar/userProfileIcon.svg";
import premiumIcon from "../../../../assets/images/SideBar/premium.svg";
import { useAuth } from "../../../../hooks/useAuth"; 
import { useUser } from "../../../../hooks/useUser"; 
import { logoutUser } from "../../../../store/actions/authActions";
import { useDispatch } from "react-redux";

export default function ProfileSidebar() {

    const {t} = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuth } = useAuth(); // Отримуємо інформацію про користувача 
    const { user, isLoading, error } = useUser(); // Отримуємо інформацію про користувача



    const logout = async () => {
      try {
        dispatch(logoutUser()); 
        console.log('Logout successful:');
        navigate('/');

      } catch (error) {
        console.error('Logout failed:', error);
      }
    };
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    // При монтуванні компонента — перевіряємо чи є збережене фото
    const savedImage = localStorage.getItem("userPhoto");
    if (savedImage) {
      setPreview(savedImage);
    }
  }, []);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result;
      // Зберігаємо base64 у localStorage
      localStorage.setItem("userPhoto", base64data);
      setPreview(base64data);
    };
    reader.readAsDataURL(file);
  };
    return (
        <>

            <aside className={styles.sidebar}>
                <div className={styles.userInfo}>

                    {isLoading && 
                    <div className={styles.portfolioContentLoader}>
                         <Loader />
                    </div>
                    }
                    {error && 
                    <div className={styles.portfolioContentLoader}>
                         <Error />
                    </div>
                    }
                    {!error && !isLoading && user!=null &&
                    <>
                    <div className={styles.userImg}>
                      <img
                        className={styles.userPhoto}
                        src={preview || userImg}  // показуємо збережене фото або дефолтне
                        alt="User Photo"
                      />
                      <button onClick={handleButtonClick} className={styles.photoIcon}>
                        <img src={iconUserImg} alt="Icon" />
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                      />
                    </div>
                    <div className={styles.title1}>
                        {user.name}
                    </div>
                    <div className={styles.title2}>
                        {user.email}
                    </div>
                    </>
                    }
                </div>
                <div className={styles.userManagement}>
                    <div className={styles.userManagementUl}>
                        <Link to="/profile" className={`${location.pathname === "/profile" ? styles.active : ""} ${styles.userManagementList}`}>
                            <div>
                                <img className={styles.managementIcon} src={userProfileIcon} alt="Icon" />
                                <span>{t('navigation.sideBarProfile.userProfile')}</span>
                            </div>
                        </Link>
                        <Link  to="/twoAuthenticator/enabled" className={`${location.pathname === "/twoAuthenticator" || location.pathname === "twoAuthenticator/disable" ? styles.active : ""} ${styles.userManagementList}`}>
                            <div>
                                <img className={styles.managementIcon} src={FAIcon} alt="Icon" />
                                <span>{t('navigation.sideBarProfile.authenticator')}</span>
                            </div>                            
                        </Link>
                        <Link to="/changePassword" className={`${location.pathname === "/changePassword" ? styles.active : ""} ${styles.userManagementList}`}>
                            <div>
                                <img className={styles.managementIcon} src={changePasswordIcon} alt="Icon" />
                                <span>{t('navigation.sideBarProfile.changePassword')}</span>
                            </div>                            
                        </Link>
                        <Link to="/premium" className={`${location.pathname === "/premium" ? styles.active : ""} ${styles.userManagementList}`}>
                            <div>
                                <img className={styles.managementIcon} src={premiumIcon} alt="Icon" />
                                <span>{t('navigation.sideBarProfile.premium')}</span>
                            </div>                             
                        </Link>
                        {isAuth ? (
                            // Якщо користувач авторизований, показуємо його ім'я
                            <button onClick={logout} className={styles.logout}>
                                {t('navigation.sideBarProfile.logout')}
                            </button>
                        ) : (
                            <>
                            </>
                        )}
                    </div>
                    <button className={styles.deleteProfile}>{t('navigation.sideBarProfile.delete')}</button>
                </div>

            </aside>
        </>
    );
}
