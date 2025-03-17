import styles from "./Analytics.module.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Sidebar from "../../components/SideBarPortfolios";
import NavbarOptions from "../../components/NavbarOptions";
import currencyImg from "../../assets/images/Dashboard/currencyImg.svg";
import openIcon from "../../assets/images/Dashboard/openIcon.svg";
import assetsIcon from "../../assets/images/Dashboard/assetsIcon.svg";
import syncIcon from "../../assets/images/Dashboard/syncIcon.svg";
import { useTranslation } from 'react-i18next';
import { Bar, Line, Doughnut } from "react-chartjs-2"
import { Link,useLocation ,useNavigate,useParams} from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { portfolioApi } from "../../api/endpoints/portfolioApi";
import { setPortfolios } from "../../store/slices/portfolioSlice";
import { useAuth } from "../../hooks/useAuth"; // 
import { infoPortfolio } from "../../store/slices/portfolioSlice";
import { usePortfolio } from "../../hooks/usePortfolio";
import { getAnalytics  } from "../../store/slices/analyticsSlice";

import approveIcon from "../../assets/images/AnalyticsPage/approveIcon.svg";
import feeIcon from "../../assets/images/AnalyticsPage/feeIcon.svg";
import receivedIcon from "../../assets/images/AnalyticsPage/receivedIcon.svg";
import transferIcon from "../../assets/images/AnalyticsPage/transferIcon.svg";
import Diagram from "../../assets/images/AnalyticsPage/Diagram.svg";

import { useRef } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
  Legend 
} from "chart.js";
import { useAnalyics } from "../../hooks/useAnalytics";


export default function Analytics() {
  const [activeSection, setActiveSection] = useState(null);
  const [sectionProgress, setSectionProgress] = useState({});
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const { t } = useTranslation();
  ChartJS.register(ArcElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sectionsRef = useRef({});
  const analiticsRef = useRef(null);
  const { isAuth } = useAuth(); 
  const { analytics,errorAnalytics,loadingAnalytics } = useAnalyics(); 
  
 
  const [assets, setAssets] = useState([]);
  const [data, setData] = useState([]);
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 10, // Додаємо відступи, щоб не обрізало
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        mode: "nearest",
        intersect: false,
        backgroundColor: "#4C4C4CFF",
        titleColor: "#fff",
        bodyColor: "#fff",
        
        padding: 5,
        displayColors: false,
        position: 'average', // Можна використати 'nearest' або 'average' для зміщення
        callbacks: {
          label: function(tooltipItem) {
            return tooltipItem.raw + '%'; // Показує відсоток або іншу інформацію в тултіп
          }
        }
      },
    },
  };/*
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
    */
    useEffect(() => {
      if (analytics?.calculatedCoins) {
        const assetLabels = analytics.calculatedCoins.map((coin) => coin.symbol);
        const assetData = analytics.calculatedCoins.map((coin) => parseFloat(coin.percentage));
    
        const baseColors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];
        const getColor = (index) => baseColors[index % baseColors.length];
    
        const newAssets = assetLabels.map((symbol, index) => ({
          symbol,
          interest: assetData[index],
          color: getColor(index),
        }));
  
        setData({
          labels: assetLabels,
          datasets: [
            {
              label: "Asset Allocation",
              data: assetData,
              backgroundColor: colors,
              borderColor: "#11141E",
              borderWidth: 2,
              hoverOffset: 20,
              cutout: "75%", 
            },
          ],
        });
  
        setAssets(newAssets);

      }
    }, [analytics]); // Виконувати, коли змінюється analytics

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
  /*
  if (!isAuth) {
    return null;
  }
  */
  return (
    <>
    <main className={styles.main}>
      <Navbar/>
      <div className={styles.userAnalitics}>
    
        <div className={styles.userAnaliticsContent}>
          <div className={styles.sideBar}> 
            <Sidebar/>
          </div>
          <div className={styles.userAnaliticsInfo}> 
            <NavbarOptions/>
              {id ? (
                  <>
                    {false && <p>Loading...</p>}
                    {false && <p className={styles.error}>Error: {errorPortfolio}</p>}
                    
                    {true && (
                    <div className={styles.analiticsContent}>
                        <div className={styles.analitics} ref={analiticsRef} >
                          <section 
                            id="allocation" 
                            ref={(el) => registerSectionRef("allocation", el)} 
                            className={styles.assetAllocation}>
                              <div  className={styles.assetAllocationWrapper}>
                                <div className={styles.chartAsset}>
                                    {/*   <Doughnut data={data} options={options} onElementsClick={(elems) => console.log(elems)} />       */}
                                    <div className={styles.greatestValue}>
                                      <div className={styles.greatestValueName}>
                                        <img   className={assetsIcon ? styles.assetsIcon : styles.hidden} 
                                        src={assetsIcon} alt="ETH"/>
                                        <span>ETH</span>
                                      </div>
                                      <div>$ 3654.10</div>
                                      <div>43.1%</div>
                                    </div>
                                </div>
                                <div className={styles.assets}>
                                  <div className={styles.topic}>Asset Allocations</div>
                                  <div className={`${styles.assetsList} ${assets?.length > 6 ? styles.twoColumns : ''}`}>
                                    <ul>
                                      {/*                                    
                                      {assets?.map((asset, index) => (
                                      <li className={styles.assetListElement} key={index}>
                                        <div className={styles.assetName}>
                                            <span>{asset.symbol} </span>
                                        </div>
                                        <div className={styles.assetInterest}>
                                          <span>{asset.interest} %</span>
                                          <div
                                            className={styles.assetColor}
                                            style={{ backgroundColor: asset.color }}
                                          ></div>
                                        </div>
                                      </li>
                                    ))}
                                      */}

                                    </ul>
                                  </div>
                                </div>
                              </div>
                          </section>
                          <section 
                            id="allocationByCategory" 
                            ref={(el) => registerSectionRef("allocationByCategory", el)} 
                            className={styles.allocationByCategory}>
                              <div className={styles.allocationByCategoryWrapper}>
                                <div className={styles.topic}>Asset Allocations by Category</div>
                              </div>
                          </section>
                          <section 
                            id="changes" 
                            ref={(el) => registerSectionRef("changes", el)} 
                            className={styles.balanceChanges}>
                          </section>
                          <section 
                            id="volatility" 
                            ref={(el) => registerSectionRef("volatility", el)} 
                            className={styles.riskVolatility}>
                          </section>
                          <section 
                            id="profiitLoss" 
                            ref={(el) => registerSectionRef("profiitLoss", el)} 
                            className={styles.totalProfiitLoss}>
                          </section>

                          <section 
                            id="cost" 
                            ref={(el) => registerSectionRef("cost", el)} 
                            className={styles.costAnalytics}>
                              <div className={styles.costAnalysisWrapper}>
                                <div className={styles.chartCostAnfLabels}>
                                      <div className={styles.chartCost}>
                                        <img className={styles.Diagram} src={Diagram} alt="Approve"/>  
                                        <div className={styles.totalSpent}>
                                            <span>Total</span>
                                            <span>$567</span>
                                            <span>Spent</span>
                                        </div>
                                      </div>
                                      <div className={styles.chartLabels}>
                                        <ul>
                                          <li className={styles.chartLabel}>
                                            <div className={styles.assetName}>
                                              <img className={styles.chartLabelIcon} src={approveIcon} alt="Approve"/>
                                              <span>Approve</span>
                                            </div>
                                            <div className={styles.assetInterest}>
                                              <span>43.1%</span>
                                              <div
                                                className={styles.assetColor}
                                                style={{ backgroundColor: `#59588D` }}
                                              ></div>
                                            </div>
                                          </li>
                                          <li className={styles.chartLabel}>
                                            <div className={styles.assetName}>
                                              <img className={styles.chartLabelIcon} src={transferIcon} alt="Transfer"/>
                                              <span>Transfer</span>
                                            </div>
                                            <div className={styles.assetInterest}>
                                              <span>43.1%</span>
                                              <div
                                                className={styles.assetColor}
                                                style={{ backgroundColor: `#59588D` }}
                                              ></div>
                                            </div>
                                          </li>
                                          <li className={styles.chartLabel}>
                                            <div className={styles.assetName}>
                                              <img className={styles.chartLabelIcon} src={receivedIcon} alt="Received"/>
                                              <span>Received</span>
                                            </div>
                                            <div className={styles.assetInterest}>
                                              <span>43.1%</span>
                                              <div
                                                className={styles.assetColor}
                                                style={{ backgroundColor: `#59588D` }}
                                              ></div>
                                            </div>
                                          </li>
                                          <li className={styles.chartLabel}>
                                            <div className={styles.assetName}>
                                              <img className={styles.chartLabelIcon} src={feeIcon} alt="Fee"/>
                                              <span>Fee</span>
                                            </div>
                                            <div className={styles.assetInterest}>
                                              <span>43.1%</span>
                                              <div
                                                className={styles.assetColor}
                                                style={{ backgroundColor: `#59588D` }}
                                              ></div>
                                            </div>
                                          </li>
                                        </ul>
                                      </div>
                                </div>

                                <div className={styles.tableCost}>
                                  <div className={styles.topic}>Cost analysis</div>
                                  <div className={styles.tradingFeesPaid}>
                                    <div  className={styles.tradingFeesPaidWrapper}>
                                      <div className={styles.topic}>Trading Fees Paid</div>
                                      <div className={styles.tradingFeesPaidInfo}>
                                        <div className={styles.elemntInfo}>
                                          <span className={styles.elemntInfoTopic}>Total Fees</span>
                                          <span>93.92 USD</span>
                                        </div>
                                        <div className={styles.elemntInfo}>
                                          <span className={styles.elemntInfoTopic}>Average</span>
                                          <span>0.8945 USD</span>
                                        </div>
                                        <div className={styles.elemntInfo}>
                                          <span className={styles.elemntInfoTopic}>Highest Free</span>
                                          <span>17.98 USD</span>
                                        </div>
                                        <div className={styles.elemntInfo}>
                                          <span className={styles.elemntInfoTopic}>Transaction Count</span>
                                          <span>54.15 USD</span>
                                        </div>
                                        <div className={styles.elemntInfo}>
                                          <span className={styles.elemntInfoTopic}>Total Fee Count</span>
                                          <span>115</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className={styles.totalGasSpent}>
                                  <div  className={styles.totalGasSpentWrapper}>
                                    <div className={styles.topic}>Total Gas Spent</div>
                                      <div className={styles.totalGasSpentInfo}>
                                        <div className={styles.elemntInfo}>
                                          <span className={styles.elemntInfoTopic}>Total Value</span>
                                          <span>93.92 USD</span>
                                        </div>
                                        <div className={styles.elemntInfo}>
                                          <span className={styles.elemntInfoTopic}>Average</span>
                                          <span>0.8945 USD</span>
                                        </div>
                                        <div className={styles.elemntInfo}>
                                          <span className={styles.elemntInfoTopic}>Highest Free</span>
                                          <span>17.98 USD</span>
                                        </div>
                                        <div className={styles.elemntInfo}>
                                          <span className={styles.elemntInfoTopic}>Transaction Count</span>
                                          <span>34.15 USD</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
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
          </div>
        </div>
      </div>
      <Footer/>
    </main>
    </>
  );
}