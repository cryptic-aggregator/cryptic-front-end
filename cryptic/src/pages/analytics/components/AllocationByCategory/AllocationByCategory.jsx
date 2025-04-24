import { Chart as ChartJS, ArcElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler } from "chart.js";
import { Doughnut } from "react-chartjs-2"
import { useEffect, useState } from "react";
import styles from "./CostAnalysis.module.css";
import approveIcon from "../../../../assets/images/AnalyticsPage/approveIcon.svg";
import feeIcon from "../../../../assets/images/AnalyticsPage/feeIcon.svg";
import receivedIcon from "../../../../assets/images/AnalyticsPage/receivedIcon.svg";
import transferIcon from "../../../../assets/images/AnalyticsPage/transferIcon.svg";
import Diagram from "../../../../assets/images/AnalyticsPage/Diagram.svg";

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
};

export default function CostAnalysis(data) {
  ChartJS.register(ArcElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler);
  const [assets, setAssets] = useState([]);
/*
  useEffect(() => {
        if (data) {
          const assetLabels = data.calculatedCoins.map((coin) => coin.symbol);
          const assetData = data.calculatedCoins.map((coin) => parseFloat(coin.percentage));
      
          const baseColors = ["#59588D", "#FFC205", "#FF3737", "#9747FF", "#00C300", "#FF9F40"];
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
                label: "Cost Analysis",
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
      }, [data]); // Виконувати, коли змінюється analytics
  */
  return (
    <>
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
    </>
  );
}
