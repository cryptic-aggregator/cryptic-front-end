import styles from "./Dashboard.module.css";

import currencyImg from "../../assets/images/Dashboard/currencyImg.svg";
import openIcon from "../../assets/images/Dashboard/openIcon.svg";
import assetsIcon from "../../assets/images/Dashboard/assetsIcon.svg";
import syncIcon from "../../assets/images/Dashboard/syncIcon.svg";
import { useTranslation } from 'react-i18next';
import { Line } from "react-chartjs-2"
import { Link,useLocation ,useNavigate,useParams} from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { portfolioApi } from "../../api/endpoints/portfolioApi";
import { setPortfolios } from "../../store/slices/portfolioSlice";
import { useAuth } from "../../hooks/useAuth"; // 
import { infoPortfolio } from "../../store/slices/portfolioSlice";
import { usePortfolio } from "../../hooks/usePortfolio";
import Loader from '../../components/common/Loader/Loader';
import Error from '../../components/common/Error/Error';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler
} from "chart.js";
import { useContainerWidth } from "../../hooks/useContainerWidth";
import { fetchBalanceChange } from "../../store/slices/analyticsSlice";
import { useAnalyics } from "../../hooks/useAnalytics";
import i18n, { formatDateLabel } from "../../lib/i18n";

export default function Dashboard() {
  const {t} = useTranslation();
  ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip,Filler);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ref, widthsState } = useContainerWidth([812]);
  const { isAuth } = useAuth(); 
  const { portfolio, loadingPortfolio, errorPortfolio }  = usePortfolio(); 
  const [coins, setCoins] = useState([]);
  const [totalWorth, setTotalWorth] = useState(0);
  const [changeText, setChangeText] = useState("");
  const [changeColor, setChangeColor] = useState("green");
  const [chartData, setChartData] = useState(null);
  const { balanceChanges } = useAnalyics();
  const data = balanceChanges.data;
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  const formatNumber = (value) => {
    const num = parseFloat(value);
    if (isNaN(num) || Math.abs(num) < 0.00001) return '0';
    return num.toFixed(4);
  };

  useEffect(() => {
    if (id) {
    dispatch(infoPortfolio(id)); // Якщо авторизований, отримуємо портфоліо
    dispatch(fetchBalanceChange({
      id: id,
      data:{
        fromTs: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0),
        toTs: new Date().setHours(23, 59, 59, 999),
        pointsCount: 120
      }
    }));
    }
  }, [navigate, dispatch, id]);
  
  const syncPortfolio = () => {
    dispatch(infoPortfolio(id));
  };

  useEffect(() => {
    if (!data ) return;
    processChartData()

  }, [data, i18n.language]);
  const createGradient = (ctx, chartArea) => {
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0, gradientColors.start);
    gradient.addColorStop(1, gradientColors.end);
    return gradient;
  };

  useEffect(() => {
    if (portfolio?.wallet_info) {
      setCoins(portfolio.wallet_info.coins);
      setTotalWorth(portfolio.wallet_info.total_portfolio_value_USDT);
    }
  }, [portfolio]);
  const gradientColors = {
    start: 'rgba(147, 71, 255, 0.3)', // Фіолетовий з прозорістю
    end: 'rgba(147, 71, 255, 0.05)',   // Більш прозорий фіолетовий
    line: '#9747FF',                   // Основний колір лінії
    lineHover: '#B967FF'               // Колір при наведенні
  };
  const processChartData = () => {
      try {
        let processedData;
        console.log(data)
        if (data && Array.isArray(data) && data.length > 0) {
          // Обробка реальних даних
          processedData = {
            labels: data.map(item => formatDateLabel(item.ts)),
            values: data.map(item => parseFloat(item.balance) || 0),
            timestamps: data.map(item => item.ts) 
          };
        }else{
           setChartData(null);
          return
        }
        const { labels, values, timestamps } = processedData;
  
        setChartData({
          labels,
          datasets: [
            {
              label: 'Balance',
              data: values.map((value, index) => ({
                x: labels[index],
                y: value,
                timestamp: timestamps[index],
              })),
              borderColor: gradientColors.line,
              backgroundColor: function(context) {
                const chart = context.chart;
                const { ctx, chartArea } = chart;
                if (!chartArea) return null;
                return createGradient(ctx, chartArea);
              },
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: gradientColors.line,
              pointBorderColor: '#ffffff',
              pointHoverBackgroundColor: gradientColors.lineHover,
              pointHoverBorderColor: '#ffffff',
              pointRadius: 0,
              pointHoverRadius: 6,
            }
          ]
        });
  
        setIsLoading(false);
      } catch (error) {
        console.error('Помилка при обробці даних діаграми:', error);
        setIsLoading(false);
      }
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
        {id ? (
            <> 

              {loadingPortfolio && 
                <div className={styles.Loader}>
                      <Loader />
                </div>
              }
              
              {errorPortfolio && 
                <div className={styles.Loader}>
                      <Error />
                </div>
              }

              { !errorPortfolio && !loadingPortfolio && portfolio && (
                <>
                  <div ref={ref} className={styles.compressedInfo}>
                    <div  className={`${styles.mainInfo} ${widthsState[812]  ? styles.compressed : ''}`}>
                      <div className={styles.compressedInfoText}>
                        <span className={styles.title}>{t("dashboard.totalWorth")}</span>
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
                          <span className={styles.balanceChangeDifferent}>
                           0 USDT / 0%
                          </span>
                          <div className={styles.changeTime}>
                            <span>24H</span>
                            <button className={styles.changeTimeButton}>
                              <img className={styles.openIcon} src={openIcon} alt="Open Currency" />
                            </button>
                          </div>
                        </div>
                      </div>
                      {chartData &&(
                        <div className={`${styles.compressedInfoGraph} ${widthsState[812] ? styles.compressedInfoGraphCompressed : ''}`}>
                          <Line data={chartData} options={options} onClick={(elems) => console.log(elems)} />
                        </div>
                      )}
                    </div>
                    <div className={styles.syncAll}>
                      <button onClick={()=> syncPortfolio()} className={styles.syncAllButton}>
                        <img className={styles.syncIcon} src={syncIcon} alt="Sync" />
                        <span>{t("dashboard.syncAll")}</span>
                      </button>
                    </div>
                  </div>
                  <div className={styles.historyInfo}>

                    {coins.length > 0 ? (
                        <>
                          <div className={styles.historyInfoWrapper}>
                            <div className={styles.assetsInfo}>
                              <span className={styles.assetsTopic}>{t("dashboard.assets")}</span>
                              <span className={styles.assetsBalance}>${totalWorth}</span>
                            </div>
                            <div className={styles.tableScroll}>
                              <table className={styles.assetsTable}>
                                <thead>
                                  <tr className={styles.assetsTableTopic}>
                                    <th>{t("dashboard.table.token")}</th>
                                    <th>{t("dashboard.table.balance")}</th>
                                    <th>{t("dashboard.table.price")}</th>
                                    <th>{t("dashboard.table.total")}</th>
                                    <th>{t("dashboard.table.avgBuy")}</th>
                                    <th>{t("dashboard.table.change1h")}</th>
                                    <th>{t("dashboard.table.allTime")}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {coins?.map((asset, index) => (
                                    <tr className={styles.assetsTableRow} key={index}>
                                      <td className={styles.assetsTableRowImg}>
                                        <img   className={asset.image ? styles.assetsIcon : styles.hidden} 
                                        src={asset.image || null} alt={asset.name} />
                                        {asset.name} | {asset.symbol}
                                      </td>
                                      <td>{formatNumber(asset.balance)}</td>
                                      <td>${formatNumber(asset.current_value)}</td>
                                      <td>${formatNumber(asset.current_market_price)}</td>
                                      <td>${formatNumber(asset.avg_purchase_rice)}</td>
                                      <td>{formatNumber(asset.price_change_1h_percent)}%</td>
                                      <td>{formatNumber(asset.change_since_avg_purchase)}%</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className={styles.notCoins}>
                        {t("dashboard.assetsEmpty")}
                        </div>
                      )}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className={styles.needSelect}>
             {t("dashboard.needSelect")}
            </div>
          )

        }

    </>
  );
}