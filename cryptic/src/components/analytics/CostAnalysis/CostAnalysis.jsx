import { Chart as ChartJS, ArcElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler } from "chart.js";
import { Doughnut } from "react-chartjs-2"
import { useEffect, useState } from "react";
import styles from "./CostAnalysis.module.css";
import approveIcon from "../../../assets/images/Analytics/approveIcon.svg";
import feeIcon from "../../../assets/images/Analytics/feeIcon.svg";
import receivedIcon from "../../../assets/images/Analytics/receivedIcon.svg";
import transferIcon from "../../../assets/images/Analytics/transferIcon.svg";
import Loader from "../../../components/common/Loader/Loader";
import { useTranslation } from "react-i18next";
import syncIcon from "../../../assets/images/Dashboard/syncIcon.svg";
import { useDispatch } from "react-redux";
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

export default function CostAnalysis({data, title, onReset}) {
  ChartJS.register(ArcElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler);
  const [assets, setAssets] = useState([]);
  const [dataForChart, setDataForChart] = useState(null);
  const [isError, setIsError] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      const assetLabels = data.map((coin) => t(`analytics.cost.assets.${coin.symbol.toLowerCase()}`));
      const assetData = data.map((coin) => parseFloat(coin.percentage));
  
      const baseColors = ["#FFC205", "#FF3737", "#00C300","#C2C2C2FF", "#59588D",  "#FF9F40"];
      const baseImg = [approveIcon, transferIcon, receivedIcon,feeIcon];
      const getColor = (index) => baseColors[index % baseColors.length];
  
      const newAssets = assetLabels.map((symbol, index) => ({
        symbol,
        interest: assetData[index],
        img: baseImg[index],
        color: getColor(index),
      }));
    
      if (assetLabels.length > 0 && assetData.length > 0) {
        setDataForChart({
            labels: assetLabels,
            datasets: [
              {
                label: "Cost Analysis",
                data: assetData,
                backgroundColor: newAssets.map((asset) => asset.color),
                borderColor: "#11141E",
                borderWidth: 2,
                hoverOffset: 20,
                cutout: "75%", 
              },
            ],
          });
        }
    
          setAssets(newAssets);
        }
    }, [data]); // Виконувати, коли змінюється analytics

  return (
    <>
      <div className={styles.costAnalysisWrapper}>
        <button className={styles.syncAllButton} onClick={onReset}>
          <img className={styles.syncIcon} src={syncIcon} alt="Sync" />
        </button>
        <div className={styles.chartCostAnfLabels}>
              <div className={styles.chartCost}> 
                {dataForChart ? (
                  <>
                    <Doughnut data={dataForChart} options={options} />
                    <div className={styles.totalSpent}>
                        <span>Total</span>
                        <span>$567</span>
                        <span>Spent</span>
                    </div>
                  </>
                ) : (
                  <Loader text="Loading chart"/>
                )}

              </div>
              <div className={styles.chartLabels}>
                <ul>
                  {assets?.map((asset, index) => (
                    <li className={styles.chartLabel} key={index}>
                      <div className={styles.assetName}>
                        <img className={styles.chartLabelIcon} src={asset.img} alt="Approve"/>
                        <span>{asset.symbol}</span>
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
                </ul>
              </div>
        </div>
        <div className={styles.tableCost}>
          <div className={styles.topic}>{title}</div>
          <div className={styles.tradingFeesPaid}>
            <div  className={styles.tradingFeesPaidWrapper}>
              <div className={styles.topic}>{t("analytics.cost.tradingFeesPaid")}</div>
              <div className={styles.tradingFeesPaidInfo}>
                <div className={styles.elemntInfo}>
                  <span className={styles.elemntInfoTopic}>{t("analytics.cost.totalFees")}</span>
                  <span>94.36 USD</span>
                </div>
                <div className={styles.elemntInfo}>
                  <span className={styles.elemntInfoTopic}>{t("analytics.cost.average")}</span>
                  <span>0.7997 USD</span>
                </div>
                <div className={styles.elemntInfo}>
                  <span className={styles.elemntInfoTopic}>{t("analytics.cost.highestFee")}</span>
                  <span>17.65 USD</span>
                </div>
                <div className={styles.elemntInfo}>
                  <span className={styles.elemntInfoTopic}>{t("analytics.cost.transactionCount")}</span>
                  <span>178</span>
                </div>
                <div className={styles.elemntInfo}>
                  <span className={styles.elemntInfoTopic}>{t("analytics.cost.totalFeeCount")}</span>
                  <span>118</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.totalGasSpent}>
          <div  className={styles.totalGasSpentWrapper}>
            <div className={styles.topic}>{t("analytics.cost.totalGasSpent")}</div>
              <div className={styles.totalGasSpentInfo}>
                <div className={styles.elemntInfo}>
                  <span className={styles.elemntInfoTopic}>{t("analytics.cost.totalValue")}</span>
                  <span>92.16 USD</span>
                </div>
                <div className={styles.elemntInfo}>
                  <span className={styles.elemntInfoTopic}>{t("analytics.cost.average")}</span>
                  <span>4.189 USD</span>
                </div>
                <div className={styles.elemntInfo}>
                  <span className={styles.elemntInfoTopic}>{t("analytics.cost.highestFee")}</span>
                  <span>17.65 USD</span>
                </div>
                <div className={styles.elemntInfo}>
                  <span className={styles.elemntInfoTopic}>{t("analytics.cost.transactionCount")}</span>
                  <span>39</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
