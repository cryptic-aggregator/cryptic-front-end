import styles from "./Analytics.module.css";
import { useTranslation } from 'react-i18next';
import { Link,useLocation ,useNavigate,useParams} from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../hooks/useAuth"; // 
import { getAnalytics  } from "../../store/slices/analyticsSlice";
import Category from "../../assets/images/AnalyticsPage/Category.jpg";
import Balance from "../../assets/images/AnalyticsPage/Balance.jpg";
import Profit from "../../assets/images/AnalyticsPage/Profit.jpg";
import Risks from "../../assets/images/AnalyticsPage/Risks.jpg";
import { useRef } from "react";
import { useAnalyics } from "../../hooks/useAnalytics";

import AssetAllocations from "./components/AssetAllocations/AssetAllocations";
import CostAnalysis from "./components/CostAnalysis/CostAnalysis";

import Loader from '../../components/common/Loader/Loader';
import Error from '../../components/common/Error/Error';

export default function Analytics() {
  const [activeSection, setActiveSection] = useState(null);
  const [sectionProgress, setSectionProgress] = useState({});
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sectionsRef = useRef({});
  const analiticsRef = useRef(null);
  const { isAuth } = useAuth(); 
  const { analytics,errorAnalytics,loadingAnalytics } = useAnalyics(); 


    // Authorization check and portfolio info loading
    useEffect(() => {
      if (!isAuth) {
        navigate("/signin");
        return;
      }
      if (id) {
        dispatch(getAnalytics(id));
        console.log(analytics)
      }
    }, [isAuth, navigate, dispatch, id]);
    
    
  // Register section ref
   const registerSectionRef = (id, element) => {
     if (element) {
       sectionsRef.current[id] = element;
     }
   };
   
  // Scroll tracking and active section management
  useEffect(() => {
    const analiticsEl = analiticsRef.current;
    if (!analiticsEl) return;
    
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = analiticsEl.scrollTop;
          const scrollHeight = analiticsEl.scrollHeight;
          const clientHeight = analiticsEl.clientHeight;
          const isBottom = scrollTop + clientHeight >= scrollHeight - 10;
          
          // Calculate overall scroll progress (0-100%)
          const totalScrollable = scrollHeight - clientHeight;
          const currentProgress = (scrollTop / totalScrollable) * 100;
          setOverallProgress(Math.min(currentProgress, 100));
          
          setIsScrolledToBottom(isBottom);
          
          // Calculate progress for each section
          const newSectionProgress = {};
          let foundActiveSection = false;
          
          Object.entries(sectionsRef.current).forEach(([id, section]) => {
            if (!section) return;
            
            const sectionRect = section.getBoundingClientRect();
            const analiticsRect = analiticsEl.getBoundingClientRect();
            const sectionTop = section.offsetTop - 160;
            const sectionHeight = section.offsetHeight;
            const sectionBottom = sectionTop + sectionHeight;
            
            // Calculate progress percentage
            let progress = 0;
            
            if (scrollTop >= sectionBottom) {
              progress = 100;
            } else if (scrollTop >= sectionTop && scrollTop <= sectionBottom) {
              progress = ((scrollTop - sectionTop) / sectionHeight) * 100;
              setActiveSection(id);
              foundActiveSection = true;
            }
            
            newSectionProgress[id] = progress;
          });
          
          setSectionProgress(newSectionProgress);
          
          // If scrolled to bottom, ensure 100% progress
          if (isBottom) {
            const allComplete = {};
            Object.keys(sectionsRef.current).forEach(id => {
              allComplete[id] = 100;
            });
            setSectionProgress(allComplete);
            
            // Set the last section as active when at bottom
            const sectionIds = Object.keys(sectionsRef.current);
            if (sectionIds.length > 0) {
              setActiveSection(sectionIds[sectionIds.length - 1]);
            }
          }
          
          ticking = false;
        });
        
        ticking = true;
      }
    };
    
    analiticsEl.addEventListener("scroll", handleScroll);
    
    // Initial check
    handleScroll();
    
    return () => analiticsEl.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Handle click on navigation items
  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    const section = sectionsRef.current[sectionId];
    const analiticsEl = analiticsRef.current;
    
    if (section && analiticsEl) {
      analiticsEl.scrollTo({
        top: section.offsetTop - 20, // Adjust offset as needed
        behavior: 'smooth'
      });
    }
  };

  if (!isAuth) {
    return null;
  }

  return (
    <>
              {id ? (
                  <>
                    {loadingAnalytics && 
                      <div className={styles.Loader}>
                            <Loader />
                      </div>
                    }
                    
                    {errorAnalytics && 
                      <div className={styles.Loader}>
                            <Error />
                      </div>
                    }

                    {!errorAnalytics && !loadingAnalytics && analytics && (
                    <div className={styles.analiticsContent}>
                        <div className={styles.analitics} ref={analiticsRef} >
                          <section 
                            id="allocation" 
                            ref={(el) => registerSectionRef("allocation", el)} 
                            className={styles.assetAllocation}>
                              <AssetAllocations data={analytics}/>
                          </section>
                          <section 
                            id="allocationByCategory" 
                            ref={(el) => registerSectionRef("allocationByCategory", el)} 
                            className={styles.allocationByCategory}>
                            <img 
                              className={styles.back} 
                              src={Category} 
                            />
                          </section>
                          <section 
                            id="changes" 
                            ref={(el) => registerSectionRef("changes", el)} 
                            className={styles.balanceChanges}>
                            <img 
                              className={styles.back} 
                              src={Balance} 
                            />
                          </section>
                          <section 
                            id="volatility" 
                            ref={(el) => registerSectionRef("volatility", el)} 
                            className={styles.riskVolatility}>
                                                          <img 
                              className={styles.back} 
                              src={Risks} 
                            />
                          </section>
                          <section 
                            id="profiitLoss" 
                            ref={(el) => registerSectionRef("profiitLoss", el)} 
                            className={styles.totalProfiitLoss}>
                                                                                        <img 
                              className={styles.back} 
                              src={Profit} 
                            />
                          </section>

                          <section 
                            id="cost" 
                            ref={(el) => registerSectionRef("cost", el)} 
                            className={styles.costAnalytics}>
                            <CostAnalysis data={analytics.calculatedCoins}/>
                          </section>
                        </div>
                        <div 
                          className={styles.analiticsNav}
                          style={{"--progress": `${overallProgress}%`}} // Use CSS variable for progress
                        >
                          <ul>
                            <li className={activeSection === "allocation" ? styles.active : ""}>
                              <a href="#allocation" onClick={(e) => handleNavClick(e, "allocation")}>
                                Asset Allocations
                              </a>
                            </li>
                            
                            <li className={activeSection === "allocationByCategory" ? styles.active : ""}>
                              <a href="#allocationByCategory" onClick={(e) => handleNavClick(e, "allocationByCategory")}>
                              Asset Allocations by Category
                              </a>
                            </li>

                            <li className={activeSection === "changes" ? styles.active : ""}>
                              <a href="#changes" onClick={(e) => handleNavClick(e, "changes")}>
                                Balance Changes
                              </a>
                            </li>
                            
                            <li className={activeSection === "volatility" ? styles.active : ""}>
                              <a href="#volatility" onClick={(e) => handleNavClick(e, "volatility")}>
                                Risks and volatility
                              </a>
                            </li>
                            
                            <li className={activeSection === "profiitLoss" ? styles.active : ""}>
                              <a href="#profiitLoss" onClick={(e) => handleNavClick(e, "profiitLoss")}>
                                Total Profit & Loss
                              </a>
                            </li>
                            
                            <li className={activeSection === "cost" ? styles.active : ""}>
                              <a href="#cost" onClick={(e) => handleNavClick(e, "cost")}>
                                Cost analysis
                              </a>
                            </li>
                          </ul>
                      </div>

                    </div>  
                    )}
                  </>
                ) : (
                  <div className={styles.needSelect}>
                    To view the information, you need to select the required portfolio from the list.
                  </div>
                )

              }
    </>
  );
}