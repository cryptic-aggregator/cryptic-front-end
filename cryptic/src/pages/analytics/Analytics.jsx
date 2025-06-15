import styles from "./Analytics.module.css";
import { useTranslation } from 'react-i18next';
import { Link,useLocation ,useNavigate,useParams} from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../hooks/useAuth"; // 
import { fetchAssetAllocation, fetchTotalProfitLoss, fetchRiskScore, fetchBalanceChange  } from "../../store/slices/analyticsSlice";
import { useRef } from "react";
import { useAnalyics } from "../../hooks/useAnalytics";
import AnalyticsSection from '../../components/analytics/AnalyticsSection/AnalyticsSection';
import AssetAllocations from "../../components/analytics/AssetAllocations/AssetAllocations";
import CostAnalysis from "../../components/analytics/CostAnalysis/CostAnalysis";

import Loader from '../../components/common/Loader/Loader';
import Error from '../../components/common/Error/Error';
import BalanceChanges from "../../components/analytics/BalanceChanges/BalanceChanges";
import Volatility from "../../components/analytics/Volatility/Volatility";
import ProfitLoss from "../../components/analytics/ProfitLoss/ProfitLoss";
import { useContainerWidth } from "../../hooks/useContainerWidth";

export default function Analytics() {
  const [activeSection, setActiveSection] = useState(null);
  const [sectionProgress, setSectionProgress] = useState({});
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [overallProgress, setOverallProgress] = useState(10);
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sectionsRef = useRef({});
  const analiticsRef = useRef(null);
  const { isAuth } = useAuth(); 
  const { ref, widthsState } = useContainerWidth([885, 500]);
  const {assetAllocation} = useAnalyics();
    // Authorization check and portfolio info loading
    useEffect(() => {
      if (id) {
        dispatch(fetchAssetAllocation(id));
        dispatch(fetchRiskScore({
          id: id,
          data:{
            symbol: "BTC",
            fromTs: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0),
            toTs: new Date().setHours(23, 59, 59, 999),
            pointsCount: 12
          }
        }));
        dispatch(fetchBalanceChange({
          id: id,
          data:{
            fromTs: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0),
            toTs: new Date().setHours(23, 59, 59, 999),
            pointsCount: 120
          }
        }));
        dispatch(fetchTotalProfitLoss({
          id: id,
          data:{
            fromTs: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0),
            toTs: new Date().setHours(23, 59, 59, 999),
            pointsCount: 120
          }
        }));
      }
    }, [navigate, dispatch, id]);

  // Register section ref
   const registerSectionRef = (id, element) => {
     if (element) {
       sectionsRef.current[id] = element;
     }
   };
   
useEffect(() => {
  const analiticsEl = analiticsRef.current;
  if (!analiticsEl) return;

  // Потім підключай скрол
  let ticking = false;

const handleScroll = () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const scrollTop = analiticsEl.scrollTop;
      const scrollHeight = analiticsEl.scrollHeight;
      const clientHeight = analiticsEl.clientHeight;
      const isBottom = scrollTop + clientHeight >= scrollHeight - 10;

      const totalScrollable = scrollHeight - clientHeight;
      const currentProgress = (scrollTop / totalScrollable) * 100;
      setOverallProgress(Math.min(currentProgress, 100));
      setIsScrolledToBottom(isBottom);

      const newSectionProgress = {};
      let foundActiveSection = false;

      Object.entries(sectionsRef.current).forEach(([id, section]) => {
        if (!section) return;

        const sectionTop = section.offsetTop - 160;
        const sectionHeight = section.offsetHeight;
        const sectionBottom = sectionTop + sectionHeight;

        let progress = 0;

        if (scrollTop >= sectionBottom) {
          progress = 100;
        } else if (scrollTop >= sectionTop && scrollTop <= sectionBottom) {
          progress = ((scrollTop - sectionTop) / sectionHeight) * 100;
          if (!foundActiveSection) {
            setActiveSection(id);
            foundActiveSection = true;
          }
        }

        newSectionProgress[id] = progress;
      });

      if (isBottom) {
        const sectionIds = Object.keys(sectionsRef.current);
        if (sectionIds.length > 0) {
          const lastId = sectionIds[sectionIds.length - 1];
          setActiveSection(lastId);
          newSectionProgress[lastId] = 100;
        }
      }

      setSectionProgress(prev => ({ ...prev, ...newSectionProgress }));

      ticking = false;
    });

    ticking = true;
  }
};


  analiticsEl.addEventListener("scroll", handleScroll);

  setTimeout(() => handleScroll(), 0);

  return () => analiticsEl.removeEventListener("scroll", handleScroll);
}, []);

  // Handle click on navigation items
const handleNavClick = (e, sectionId) => {
  e.preventDefault();
  const section = sectionsRef.current[sectionId];
  const analiticsEl = analiticsRef.current;
  
  if (section && analiticsEl) {
    const sectionRect = section.getBoundingClientRect();
    const containerRect = analiticsEl.getBoundingClientRect();

    const offset = sectionRect.top - containerRect.top;

    analiticsEl.scrollTo({
      top: analiticsEl.scrollTop + offset - 10, // -20 або інший відступ
      behavior: 'smooth'
    });
  }
};

  return (
    <>
              {id ? (
                  <>

                    <div ref={ref} className={`${styles.analiticsContent}  ${widthsState[885] ? styles.narrowAnalitics : ''}`}>
                        <div className={styles.analitics} ref={analiticsRef} >
                          <AnalyticsSection
                            sectionId="assetAllocation"
                            title={t("analytics.navigator.assetAllocations")}
                            renderData={(data, title) => <AssetAllocations portfolioId={id} data={data} title={title} onReset={() => dispatch(fetchAssetAllocation(id))}/>}
                            dataState={assetAllocation}
                            onReset={() => dispatch(fetchAssetAllocation(id))}
                            registerRef={registerSectionRef}
                          />

                          <BalanceChanges
                            sectionId="balanceChanges"
                            title={t("analytics.navigator.balanceChanges")}
                            portfolioId={id}
                            onReset={() => dispatch(fetchBalanceChange({
                              id: id,
                              data:{
                                fromTs: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0),
                                toTs: new Date().setHours(23, 59, 59, 999),
                                pointsCount: 120
                              }
                            }))}
                            registerRef={registerSectionRef}
                          />

                          <Volatility
                            sectionId="risksAndVolatility"
                            title={t("analytics.navigator.risksAndVolatility")}
                            portfolioId={id}
                            onReset={() => dispatch(fetchRiskScore({
                              id: id,
                              data:{
                                symbol: "BTC",
                                fromTs: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0),
                                toTs: new Date().setHours(23, 59, 59, 999),
                                pointsCount: 12
                              }
                            }))}
                            registerRef={registerSectionRef}
                          />

                          <ProfitLoss
                            sectionId="totalProfitLoss"
                            title={t("analytics.navigator.totalProfitLoss")}
                            portfolioId={id}
                            onReset={() => dispatch(fetchTotalProfitLoss({
                              id: id,
                              data:{
                                fromTs: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0),
                                toTs: new Date().setHours(23, 59, 59, 999),
                                pointsCount: 120
                              }
                            }))}
                            registerRef={registerSectionRef}
                          />
                    

                          <AnalyticsSection
                            sectionId="costAnalysis"
                            title={t("analytics.navigator.costAnalysis")}
                            renderData={(data, title) => <CostAnalysis data={data} title={title}/>}
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
                            onReset={() => dispatch(fetchAssetAllocation(id))}
                            registerRef={registerSectionRef}
 
                          />
                        </div>
                        <div 
                          className={styles.analiticsNav}
                          style={{"--progress": `${overallProgress}%`}} // Use CSS variable for progress
                        >
                          <ul>
                            <li className={activeSection === "assetAllocation" ? styles.active : ""}>
                              <a href="#assetAllocation" onClick={(e) => handleNavClick(e, "assetAllocation")}>
                                {t("analytics.navigator.assetAllocations")}
                              </a>
                            </li>

                            <li className={activeSection === "balanceChanges" ? styles.active : ""}>
                              <a href="#balanceChanges" onClick={(e) => handleNavClick(e, "balanceChanges")}>
                                {t("analytics.navigator.balanceChanges")}
                              </a>
                            </li>
                            
                            <li className={activeSection === "risksAndVolatility" ? styles.active : ""}>
                              <a href="#risksAndVolatility" onClick={(e) => handleNavClick(e, "risksAndVolatility")}>
                                {t("analytics.navigator.risksAndVolatility")}
                              </a>
                            </li>
                            
                            <li className={activeSection === "totalProfitLoss" ? styles.active : ""}>
                              <a href="#totalProfitLoss" onClick={(e) => handleNavClick(e, "totalProfitLoss")}>
                                {t("analytics.navigator.totalProfitLoss")}
                              </a>
                            </li>
                            
                            <li className={activeSection === "costAnalysis" ? styles.active : ""}>
                              <a href="#costAnalysis" onClick={(e) => handleNavClick(e, "costAnalysis")}>
                                {t("analytics.navigator.costAnalysis")}
                              </a>
                            </li>
                          </ul>
                      </div>

                    </div>  

                  </>
                ) : (
                  <div className={styles.needSelect}>
                    {t("analytics.selectPortfolioMessage")}
                  </div>
                )

              }
    </>
  );
}