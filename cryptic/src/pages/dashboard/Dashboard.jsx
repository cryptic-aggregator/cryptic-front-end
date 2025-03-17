import styles from "./Dashboard.module.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Sidebar from "../../components/SideBarPortfolios";
import NavbarOptions from "../../components/NavbarOptions";
import currencyImg from "../../assets/images/Dashboard/currencyImg.svg";
import openIcon from "../../assets/images/Dashboard/openIcon.svg";
import assetsIcon from "../../assets/images/Dashboard/assetsIcon.svg";
import syncIcon from "../../assets/images/Dashboard/syncIcon.svg";
import { useTranslation } from 'react-i18next';
import { Line } from "react-chartjs-2"
import { Link,useLocation ,useNavigate,useParams} from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { portfolioApi } from "../../api/endpoints/portfolioApi";
import { setPortfolios } from "../../store/slices/portfolioSlice";
import { useAuth } from "../../hooks/useAuth"; // 
import { infoPortfolio } from "../../store/slices/portfolioSlice";
import { usePortfolio } from "../../hooks/usePortfolio";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler
} from "chart.js";

export default function Dashboard() {
  const {t} = useTranslation();
  ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip,Filler);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuth } = useAuth(); 
  const { portfolio, loadingPortfolio, errorPortfolio }  = usePortfolio(); 
  const [coins, setCoins] = useState([]);
  const [totalWorth, setTotalWorth] = useState(0);
  
  useEffect(() => {
    if (!isAuth) {
      navigate("/signin"); // Якщо не авторизований, перенаправляємо на сторінку входу
    } else if (id) {
      dispatch(infoPortfolio(id)); // Якщо авторизований, отримуємо портфоліо
    }
  }, [isAuth, navigate, dispatch, id]);
  
  useEffect(() => {
    if (portfolio?.wallet_info) {
      setCoins(portfolio.wallet_info.coins);
      setTotalWorth(portfolio.wallet_info.total_portfolio_value_USDT);
    }
  }, [portfolio]);

  // Data setup
  const data = {
    labels: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00"],
    datasets: [
      {
        label: "Balance",
        data: [100, 98, 95, 110, 92, 90],
        borderColor: "rgba(192, 132, 252, 1)", // Purple line
        borderWidth: 2,
        fill: true,
        backgroundColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          
          if (!chartArea) {
            // This case happens on initial chart load
            return 'rgba(192, 132, 252, 0.3)';
          }
          
          // Create gradient
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(192, 132, 252, 0.5)");
          gradient.addColorStop(1, "rgba(192, 132, 252, 0)");
          
          return gradient;
        },
        tension: 0.4, // Smoothed line
        pointRadius: 0, // Hide points
        pointHoverRadius: 6, // Show points on hover
        pointHoverBackgroundColor: "#C084FC"
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: false // Hide X axis labels
      },
      y: {
        display: false // Hide Y axis labels
      }
    },
    plugins: {
      legend: { display: false }, // Hide legend
      tooltip: {
        enabled: true,
        mode: "nearest", // Show nearest point
        intersect: false,
        backgroundColor: "rgba(192, 132, 252, 0.9)",
        titleColor: "#FFF",
        bodyColor: "#FFF",
        padding: 10,
        displayColors: false
      }
    }
  };
  if (!isAuth) {
    return null;  // Якщо не авторизований, нічого не відображається
  }

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

            {id ? (
                <>
                  {loadingPortfolio && <p>Loading...</p>}
                  {errorPortfolio && <p className={styles.error}>Error: {errorPortfolio}</p>}
                  
                  {portfolio && (
                    <>
                      <div className={styles.compressedInfo}>
                        <div className={styles.mainInfo}>
                          <div className={styles.compressedInfoText}>
                            <span className={styles.title}>Total Worth</span>
                            <div className={styles.balance}>
                              <span title={totalWorth} className={styles.currentBalance}>
                                {totalWorth.length > 8 ? totalWorth.slice(0, 6) : totalWorth}
                              </span>
                              <img className={styles.currencyImg} src={currencyImg} alt="Current Currency" />
                              <div className={styles.changeCurrency}>
                                <span>USDT</span>
                                <button className={styles.changeCurrencyButton}>
                                  <img className={styles.openIcon} src={openIcon} alt="Open Currency" />
                                </button>
                              </div>
                            </div>
                            <div className={styles.balanceChange}>
                              <span className={styles.balanceChangeDifferent}>-19.1 USDT / 25.67%</span>
                              <div className={styles.changeTime}>
                                <span>24H</span>
                                <button className={styles.changeTimeButton}>
                                  <img className={styles.openIcon} src={openIcon} alt="Open Currency" />
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className={styles.compressedInfoGraph}>
                            <Line data={data} options={options} onElementsClick={(elems) => console.log(elems)} />
                          </div>
                        </div>
                        <div className={styles.syncAll}>
                          <button className={styles.syncAllButton}>
                            <img className={styles.syncIcon} src={syncIcon} alt="Sync" />
                            <span>Sync All</span>
                          </button>
                        </div>
                      </div>
                      <div className={styles.historyInfo}>

                        {coins.length > 0 ? (
                            <>
                              <div className={styles.historyInfoWrapper}>
                                <div className={styles.assetsInfo}>
                                  <span className={styles.assetsTopic}>Assets</span>
                                  <span className={styles.assetsBalance}>${totalWorth}</span>
                                </div>
                                <table className={styles.assetsTable}>
                                  <thead>
                                    <tr className={styles.assetsTableTopic}>
                                      <th>Token</th>
                                      <th>Balance</th>
                                      <th>Price</th>
                                      <th>Total</th>
                                      <th>Avg Buy</th>
                                      <th>1H Change</th>
                                      <th>All Time</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {coins?.map((asset, index) => (
                                      <tr className={styles.assetsTableRow} key={index}>
                                        <td className={styles.assetsTableRowImg}>
                                          <img   className={asset.image ? styles.assetsIcon : styles.hidden} 
                                          src={asset.image} alt={asset.name} />
                                          {asset.name} | {asset.symbol}
                                        </td>
                                        <td>{asset.balance}</td>
                                        <td>${asset.current_value}</td>
                                        <td>${asset.current_market_price}</td>
                                        <td>${asset.avg_purchase_rice}</td>
                                        <td>{asset.price_change_1h_percent}%</td>
                                        <td>{asset.change_since_avg_purchase}%</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </>
                          ) : (
                            <div className={styles.notCoins}>
                              You don't have any coins in your portfolio yet. Add your first one to start tracking your assets!
                            </div>
                          )}
                      </div>
                    </>
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