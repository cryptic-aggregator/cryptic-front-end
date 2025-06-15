import { 
  Chart as ChartJS, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import styles from "./Volatility.module.css";
import Loader from "../../../components/common/Loader/Loader";
import DateRangePicker from "../../../components/common/DateRangePicker/DateRangePicker";
import { useTranslation } from "react-i18next";
import i18n, { formatDate, formatDateLabel } from "../../../lib/i18n";
import ethereumIcon from "../../../assets/images/Wallets/ethereumIcon.svg";
import bitcoinIcon from "../../../assets/images/Wallets/bitcoinIcon.svg";
import solanaIcon from "../../../assets/images/Wallets/solanaIcon.svg";
import networkSelect from "../../../assets/images/Wallets/networkSelect.svg";
import { useDispatch } from "react-redux";
import { fetchRiskScore } from "../../../store/slices/analyticsSlice";
import { useAnalyics } from "../../../hooks/useAnalytics";
import syncIcon from "../../../assets/images/Dashboard/syncIcon.svg";
// Реєструємо необхідні компоненти Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
export default function Volatility ({sectionId , portfolioId, title, onReset, registerRef}) {
  // ========================
  // СТАН КОМПОНЕНТА
  // ========================
  const { t } = useTranslation();
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const selectBoxRef = useRef(null);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const { risksAndVolatility } = useAnalyics();
  const data = risksAndVolatility.data;

  // ========================
  // КОНСТАНТИ КОНФІГУРАЦІЇ
  // ========================
  const filterKeys = ["h24", "w1", "m1", "m3", "m6", "y1", "y2"];
  const filterOptions = filterKeys.map((key) => ({
    value: key,
    label: t(`common.filters.short.${key}`)
  }));
  const [activeFilter, setActiveFilter] = useState(filterOptions[1].value);
  const networks =[
    { value: "USDT", label: "USDT", icon: ethereumIcon },
    { value: "BTC", label: "BTC", icon: bitcoinIcon },
    { value: "SOL", label: "SOL", icon: solanaIcon },
  ];
  
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0]);

  // Кольорова схема градієнта
  const gradientColorsFirst = {
      start: 'rgba(255, 194, 5, 0.3)',
      end: 'rgba(255, 194, 5, 0.05)',
      line: '#FFC205',
      lineHover: '#FFD700'
  };
  const gradientColorsSecond = {
      start: 'rgba(0, 195, 0, 0.3)',
      end: 'rgba(0, 195, 0, 0.05)',
      line: '#00C300',
      lineHover: '#00FF00'
  };
  // ========================
  // КОНФІГУРАЦІЯ ДІАГРАМИ
  // ========================
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false, // Приховуємо легенду
      },
      tooltip: {
  enabled: true, // Включаємо стандартний tooltip
  mode: 'index',
  intersect: false,
  backgroundColor: '#454545',
  titleColor: 'white',
  bodyColor: 'white',
  borderColor: 'rgba(255, 255, 255, 0.1)',
  borderWidth: 1,
  cornerRadius: 8,
  displayColors: true,
  titleFont: {
    size: 14,
    family: 'Inter, sans-serif',
    weight: 'bold'
  },
  bodyFont: {
    size: 14,
    family: 'Inter, sans-serif'
  },
  padding: 12,
  // Автоматичне позиціонування
  position: 'nearest',
  usePointStyle:true,
  // Кастомізація відображення значень
  callbacks: {
    title: function(tooltipItems) {
      // Отримуємо timestamp для перетворення в повну дату
      const timestamp = tooltipItems[0]?.raw?.timestamp;

      if (!timestamp) return '';
      return formatDate(timestamp);
    },
    label: function(context) {
      return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}`;
    },
    labelColor: function(context) {
      // Повертаємо круглі кольори
      return {
        borderColor: 'transparent',
        borderWidth: 0,
        backgroundColor: context.dataset.borderColor,
        borderRadius: 20, // Це робить кольори круглими
      };
    }

    
  }

      },
    },
    scales: {
      y: {
        display: true,
        position: 'left',
        grid: {
          display: true,
          color: 'rgba(255, 255, 255, 0.1)',
          lineWidth: 1,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12,
            family: 'Inter, sans-serif'
          },
          callback: function(value) {
            return '$' + value.toFixed(0);
          },
        },
        border: {
          display: false,
        }
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
  };

  // ========================
  // ДОПОМІЖНІ ФУНКЦІЇ
  // ========================

  /**
   * Створює градієнт для заливки області під графіком
   * @param {CanvasRenderingContext2D} ctx - Контекст Canvas
   * @param {Object} chartArea - Область діаграми
   * @returns {CanvasGradient} Градієнт
   */
  const createGradientFirst = (ctx, chartArea) => {
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0, gradientColorsFirst.start);
    gradient.addColorStop(1, gradientColorsFirst.end);
    return gradient;
  };
  const createGradientSecond = (ctx, chartArea) => {
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0, gradientColorsSecond.start);
    gradient.addColorStop(1, gradientColorsSecond.end);
    return gradient;
  };
  const handleSelect = (network) => {
    setSelectedNetwork(network);
    setIsOpen(false);
  };


  /**
   * Обробляє дані та створює конфігурацію для діаграми
   */
  const processChartData = () => {
    try {
      let processedData;
          console.log(data)
      if (data && Array.isArray(data) && data.length > 0) {
        // Обробка реальних даних
        processedData = {
          labels: data.map(item => formatDateLabel(item.ts)),
          symbol : data.map(item => parseFloat(item.token_price )),
          portfolio : data.map(item => parseFloat(item.portfolio_value )),
          timestamps: data.map(item => item.ts) 
        };
      }else{
        return
      }

      const { labels, symbol, portfolio, timestamps } = processedData;

      setChartData({
        labels,
        datasets: [
          {
            label: selectedNetwork.value,
            data: symbol.map((value, index) => ({
              x: labels[index],
              y: value,
              timestamp: timestamps[index],
            })),
            borderColor: gradientColorsFirst.line,
            backgroundColor: function(context) {
              const chart = context.chart;
              const { ctx, chartArea } = chart;
              if (!chartArea) return null;
              return createGradientFirst(ctx, chartArea);
            },
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: gradientColorsFirst.line,
            pointHoverBackgroundColor: gradientColorsFirst.lineHover,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointStyle: 'circle', 
          },
          {
            label: 'Portfolio',
            data: portfolio.map((value, index) => ({
              x: labels[index],
              y: value,
              timestamp: timestamps[index],
            })),
            borderColor: gradientColorsSecond.line,
            backgroundColor: function(context) {
              const chart = context.chart;
              const { ctx, chartArea } = chart;
              if (!chartArea) return null;
              return createGradientSecond(ctx, chartArea);
            },
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: gradientColorsSecond.line,
            pointHoverBackgroundColor: gradientColorsSecond.lineHover,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointStyle: 'circle', 
          }
        ]
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Помилка при обробці даних діаграми:', error);
      setIsLoading(false);
    }
  };

  // ========================
  // ЕФЕКТИ
  // ========================
    useEffect(() => {
      setActiveFilter(filterOptions[1].value);
      setSelectedNetwork(networks[0]);
    }, [portfolioId]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectBoxRef.current && !selectBoxRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /**
   * Ініціалізація та обробка даних при зміні пропсів
   */
  const sync = () => {
    if (!selectedNetwork.value || !dateRange.startDate || !dateRange.endDate) return;

    const startTimestamp = Math.floor((dateRange.startDate).setHours(0, 0, 0, 0) / 1000);
    const endTimestamp = Math.floor((dateRange.endDate).setHours(23, 59, 59, 999) / 1000);
   
    dispatch(fetchRiskScore({
      id: portfolioId,
      data: {
        symbol: selectedNetwork.value,
        fromTs: startTimestamp,
        toTs: endTimestamp,
        pointsCount: 12
      }
    }));
  };

  useEffect(() => {
    if (!selectedNetwork.value || !dateRange.startDate || !dateRange.endDate) return;

    const startTimestamp = Math.floor((dateRange.startDate).setHours(0, 0, 0, 0) / 1000);
    const endTimestamp = Math.floor((dateRange.endDate).setHours(23, 59, 59, 999) / 1000);
   
    dispatch(fetchRiskScore({
      id: portfolioId,
      data: {
        symbol: selectedNetwork.value,
        fromTs: startTimestamp,
        toTs: endTimestamp,
        pointsCount: 12
      }
    }));

  }, [selectedNetwork.value, dateRange.startDate, dateRange.endDate]);

  useEffect(() => {
    if (!data ) return;
    processChartData()

  }, [data, i18n.language]);
  // ========================
  // КОМПОНЕНТИ РЕНДЕРИНГУ
  // ========================

  /**
   * Рендерить кнопки вибору періоду
   */
  const renderTimeframeButtons = () => {
  if (!data || data.length === 0) return null;

    return(
          <div className={styles.filterContainer}>
        {filterOptions.map((option) => (
          <button
            key={option.value}
            className={`${styles.filterButton} ${
              activeFilter === option.value ? styles.filterButtonActive : ""
            }`}
            onClick={() => setActiveFilter(option.value)}
          >
            {option.label}
          </button>
        ))}
        
        <div
          className={`${styles.filterButton} ${
            activeFilter === "custom" ? styles.filterButtonActive : ""
          }`}
          onClick={() => setActiveFilter("custom")}
        >
          <DateRangePicker
            activeFilter={activeFilter}
            onRangeChange={(range) => setDateRange(range)}
          />
        </div>
      </div>
    );

  };

  /**
   * Рендерить основну діаграму
   */
  const renderChart = () => 
    
    {

    if (isLoading) {
      return (
        <div className={styles.loaderContainer}>
          <Loader text={t("analytics.cost.loading")} />
        </div>
      );
    }


    if (risksAndVolatility.error) {
      return (
        <div className={styles.loaderContainer}>
             <Error text={risksAndVolatility.error}/>
        </div>
      );
    }

    if (risksAndVolatility.data == null || risksAndVolatility.data?.length == 0) {
      return (
        <div className={styles.assetNoFind}>
          <span>
            {t("analytics.section.dataUnavailable", { title: title.toLowerCase() })}
          </span>
          {onReset && <button className={styles.reset} onClick={onReset}> {t("analytics.section.reset")}</button>}
        </div>
      );
    }

    return (
      <div className={styles.chartContainer}>
        <Line data={chartData} options={chartOptions} />
      </div>
    );
  };
  /**
   * Рендерить селектор
   */
  const renderSelectedNetwork= () => {
      if (!data || data.length === 0) return null;

    return (
      <div className={styles.networkSelector}>
      
          <div  className={styles.selectBox} onClick={() => setIsOpen(!isOpen)}>
            <img src={selectedNetwork.icon} alt={selectedNetwork.label} className={styles.icon} />
            <span>{selectedNetwork.label}</span>
            <img src={networkSelect} alt="networkSelectIcon" className={styles.networkSelectIcon} />
          </div>

          {isOpen && (
            <div ref={selectBoxRef} className={styles.dropdown}>
              {networks.map((network) => (
                <div
                  key={network.value}
                  className={styles.option}
                  onClick={() => handleSelect(network)}
                >
                  <img src={network.icon} alt={network.label} className={styles.icon} />
                  <span>{network.label}</span>
                </div>
              ))}
            </div>
          )}
      </div>
    );
  };
    /**
   * Рендерить статистику
   */
  const renderStatistic= () => {
      if (!data || data.length === 0) return null;

    return (
      
      <div className={styles.container}>
        <div className={styles.item}>
          <div className={styles.dot} style={{ backgroundColor: "#FFC205" }} />
          <span className={styles.label} style={{ color: "#FFC205" }}>{selectedNetwork.value}</span>
          <span className={styles.price}>{data[data.length -1].token_price}</span>
          <span
            className={styles.change}
            style={{
              color:
                data[data.length - 1].token_change_pct > 0
                  ? "#00C300"
                  : data[data.length - 1].token_change_pct < 0
                  ? "#FF3737"
                  : "#FFFFFF"
            }}
          >
            {data[data.length - 1].token_change_pct}%
          </span>
        </div>

        <div className={styles.item}>
          <div className={styles.dot} style={{ backgroundColor: "#00C300" }} />
          <span className={styles.label} style={{ color: "#00C300" }}>Portfolio</span>
          <span className={styles.price}>{data[data.length -1].portfolio_value}</span>
          <span
            className={styles.change}
            style={{
              color:
                data[data.length - 1].portfolio_change_pct > 0
                  ? "#00C300"
                  : data[data.length - 1].portfolio_change_pct < 0
                  ? "#FF3737"
                  : "#FFFFFF"
            }}
          >
            {data[data.length - 1].portfolio_change_pct}%
          </span>
        </div>
      </div>
    );
  };
  
  // ========================
  // ОСНОВНИЙ РЕНДЕР
  // ========================
  
  // Перевірка на відсутність даних або помилку
  if (!data || data.length === 0 || isError) {
    return (
      <section id={sectionId} ref={(el) => registerRef(sectionId, el)} className={styles.balanceChangesSection}>
        <div className={styles.balanceChangesWrapper}>
          <div className={styles.balanceChanges}>
            <div className={styles.assetNoFind}>
              <span>
                {t("analytics.section.dataUnavailable", { title: title.toLowerCase() })}
              </span>
              {onReset && <button className={styles.reset} onClick={onReset}> {t("analytics.section.reset")}</button>}
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  return (
 <section id={sectionId} ref={(el) => registerRef(sectionId, el)} className={styles.balanceChangesSection}>
      <div className={styles.balanceChangesWrapper}>   
          <button className={styles.syncAllButton} onClick={sync}>
            <img className={styles.syncIcon} src={syncIcon} alt="Sync" />
          </button>
        <div className={styles.balanceChanges}>
          <div className={styles.header}>{title}</div>
          {renderSelectedNetwork()}
          {renderChart()}
          {renderTimeframeButtons()}
          {renderStatistic()}
        </div>
      </div>
    </section>
  );
}