import styles from "./Analytics.module.css";
import { useTranslation } from 'react-i18next';
import { Link,useLocation ,useNavigate,useParams} from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../hooks/useAuth"; // 
import { fetchAssetAllocation, fetchPerformance, fetchRiskScore, fetchTokenDistribution, fetchWalletActivity  } from "../../store/slices/analyticsSlice";
import Category from "../../assets/images/AnalyticsPage/Category.jpg";
import Balance from "../../assets/images/AnalyticsPage/Balance.jpg";
import Profit from "../../assets/images/AnalyticsPage/Profit.jpg";
import Risks from "../../assets/images/AnalyticsPage/Risks.jpg";
import { useRef } from "react";
import { useAnalyics } from "../../hooks/useAnalytics";
import AnalyticsSection from './components/AnalyticsSection/AnalyticsSection';
import AssetAllocations from "./components/AssetAllocations/AssetAllocations";
import CostAnalysis from "./components/CostAnalysis/CostAnalysis";

import Loader from '../../components/common/Loader/Loader';
import Error from '../../components/common/Error/Error';
import BalanceChanges from "./components/BalanceChanges/BalanceChanges";

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
  const { assetAllocation, performance, tokenDistribution, walletActivity, riskScore } = useAnalyics(); 


    // Authorization check and portfolio info loading
    useEffect(() => {
      if (id) {
        dispatch(fetchAssetAllocation(id));
        /*
        dispatch(fetchPerformance(id));
        dispatch(fetchRiskScore(id));
        ispatch(fetchTokenDistribution(id));
        dispatch(fetchWalletActivity(id));*/
      }
    }, [navigate, dispatch, id]);
    
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
  
  const handleDateRangeChange = async (startDate, endDate) => {
/*
    try {
      await dispatch(fetchAssetAllocation(id));

    } catch (err) {

    }*/
  };

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

                    <div className={styles.analiticsContent}>
                        <div className={styles.analitics} ref={analiticsRef} >
                          <AnalyticsSection
                            sectionId="allocation"
                            title="Asset Allocation"
                            dataState={assetAllocation}
                            renderData={(data) => <AssetAllocations data={data} />}
                            onReset={() => dispatch(fetchAssetAllocation(id))}
                            registerRef={registerSectionRef}
                          />

                          <AnalyticsSection
                            sectionId="changes"
                            title="Balance Changes"
                            dataState={{loading: false, error: false, data: 
                              [
                                { date: 'Sep 13', balance: 18.5, timestamp: 1694649600 },
                                { date: 'Sep 20', balance: 12.8, timestamp: 1695254400 },
                                { date: 'Oct 13', balance: 38.2, timestamp: 1697155200 },
                                { date: 'Nov 12', balance: 35.7, timestamp: 1699747200 },
                                { date: 'Dec 12', balance: 37.1, timestamp: 1702339200 },
                                { date: 'Jan 12', balance: 24.3, timestamp: 1704931200 },
                                { date: 'Feb 11', balance: 72.5, timestamp: 1707609600 },
                                { date: 'Mar 11', balance: 45.8, timestamp: 1710115200 },
                                { date: 'Apr 10', balance: 46.7, timestamp: 1712707200 },
                                { date: 'May 10', balance: 38.2, timestamp: 1715299200 },
                              ]
                            }}
                            renderData={(data) => <BalanceChanges data={data} onDateRangeChange={handleDateRangeChange} />}
                            onReset={() => dispatch(fetchAssetAllocation(id))}
                            registerRef={registerSectionRef}
                          />
                          <AnalyticsSection
                            sectionId="volatility"
                            title="Total Profit & Loss"
                            dataState={{loading: false, error: false,data: null}}
                            renderData={null}
                            onReset={() => dispatch(fetchAssetAllocation(id))}
                            registerRef={registerSectionRef}
                          />
                          <AnalyticsSection
                            sectionId="profiitLoss"
                            title="Risks and volatility"
                            dataState={{loading: false, error: false,data: null}}
                            renderData={null}
                            onReset={() => dispatch(fetchAssetAllocation(id))}
                            registerRef={registerSectionRef}
                          />
                          <AnalyticsSection
                            sectionId="cost"
                            title="Cost analysis"
                            dataState={{
                              loading: false,
                              error: false,
                              data: 
                               [
                                  { symbol: "Approve", percentage: "40" },
                                  { symbol: "Transfer", percentage: "25" },
                                  { symbol: "Received", percentage: "15" },
                                  { symbol: "Fee", percentage: "10" },

                                ]
                              
                            }}
                            renderData={(data) => <CostAnalysis data={data} />}
                            onReset={() => dispatch(fetchAssetAllocation(id))}
                            registerRef={registerSectionRef}
                          />
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