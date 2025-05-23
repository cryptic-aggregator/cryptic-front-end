import styles from "./PortfoliosSidebar.module.css";
import { useState, useEffect } from "react";
import Modal from "../../../Modal/PortfolioCreateModal/PortfolioCreateModal";
import { Link,useLocation ,useNavigate, useParams} from "react-router-dom";
import { useTranslation } from 'react-i18next';
import closeBar from "../../../../assets/images/SideBarPortfolios/closeBar.svg";
import editPortfolios from "../../../../assets/images/SideBarPortfolios/editPortfolios.svg";
import { usePortfolio } from "../../../../hooks/usePortfolio";  // Глобальний стан авторизації
import { useAuth } from "../../../../hooks/useAuth"; // Глобальний стан авторизації
import { useDispatch } from "react-redux";
import { fetchPortfolios,deletePortfolio  } from "../../../../store/slices/portfolioSlice";
import React from 'react';
import Loader from '../../../common/Loader/Loader';
import Error from '../../../common/Error/Error';
export default function PortfoliosSidebar({ isOpen, setIsOpen }) {
 
    const { isAuth } = useAuth(); 
    const { portfolios, loadingPortfolios, errorPortfolios }  = usePortfolio(); 
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const {t} = useTranslation();
    const location = useLocation();
    const basePath = location.pathname.split('/')[1]; // 'dashboard' або 'analytics'
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [hoveredDeleteId, setHoveredDeleteId] = useState(null);

    useEffect(() => {
        if (!isAuth) {
          navigate("/signin"); // Якщо не авторизований, перенаправляємо на сторінку входу
        } else {
          dispatch(fetchPortfolios()); // Якщо авторизований, забираємо портфелі
        }
      }, [isAuth, dispatch]); // Залежності для ефекту

    const handleDelete = async (e, portfolioId) => {
        e.preventDefault(); 
        
        dispatch(deletePortfolio(portfolioId));
    }
    if (!isAuth) {
        return null;  // Якщо не авторизований, нічого не відображається
    }
    return (
        <>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarInfo}>
                    <div className={styles.topicContentWrapper}>
                        <div className={styles.topicContent}>
                            <div className={styles.topic}>All Portfolios</div>
                            <button  onClick={() => setIsOpen(!isOpen)} className={styles.closeBar}><img src={closeBar} alt="Icon" /></button>
                        </div>
                    </div>
                    {loadingPortfolios && 
                    <div className={styles.portfolioContentLoader}>
                         <Loader />
                    </div>
                    }
                    {errorPortfolios && 
                    <div className={styles.portfolioContentLoader}>
                         <Error />
                    </div>
                    }
                    {!errorPortfolios && !loadingPortfolios && 
                    <>
                        <div className={styles.userPortfoliosList} >
                            {Array.isArray(portfolios) && portfolios.length > 0 ? (
                                portfolios.map((portfolio) => (
                                    <Link 
                                    key={portfolio.id}
                                    to={`/${basePath}/${portfolio.id}`} 
                                    title={portfolio.name}
                                    className={`
                                        ${location.pathname === `/${basePath}/${portfolio.id}` ? styles.active : ""} 
                                        ${styles.userPortfolio}
                                        ${hoveredDeleteId === portfolio.id ? styles.deleteHovered : ""}
                                    `}
                                >
                                    <div className={styles.portfolioContent}>
                                        <span className={styles.portfolioName}>{portfolio.name}</span>
                                        <button 
                                            className={styles.editPortfolios} 
                                            onClick={(e) => handleDelete(e, portfolio.id)}
                                            onMouseEnter={() => setHoveredDeleteId(portfolio.id)}
                                            onMouseLeave={() => setHoveredDeleteId(null)}
                                        >
                                            <img  title={'edit'} src={editPortfolios} alt="Icon" />
                                        </button>
                                    </div>
                                </Link>
                                ))
                            ): (<>
                                    <span className={styles.emptyMessage}>You don't have a portfolio yet, but you can easily create one</span>
                                    <div onClick={() => setModalIsOpen(true)} className={styles.createPortfolioEmpty}>Create Portfolio Now</div>
                                </>
                            )}
                        </div>
                    </>
                    }

                </div>
                <div onClick={() => setModalIsOpen(true)} className={styles.createPortfoliotWrapper}>
                    <div  className={styles.createPortfolio}>Create Portfolio</div>   
                </div> 
                <Modal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)}></Modal>   
            </aside> 

        </>
    );
}
