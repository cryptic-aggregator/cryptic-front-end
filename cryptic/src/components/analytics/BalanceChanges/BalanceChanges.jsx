
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
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import styles from "./BalanceChanges.module.css";
import Loader from "../../../components/common/Loader/Loader";
import DateRangePicker from "../../../components/common/DateRangePicker/DateRangePicker";
import { useTranslation } from "react-i18next";
import i18n, { formatDate, formatDateLabel } from "../../../lib/i18n";
import { useDispatch } from "react-redux";
import { fetchBalanceChange } from "../../../store/slices/analyticsSlice";
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

export default function BalanceChanges({sectionId , portfolioId, title, onReset, registerRef}) {
  // ========================
  // СТАН КОМПОНЕНТА
  // ========================
  const { t } = useTranslation();
  const [chartData, setChartData] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const { balanceChanges } = useAnalyics();
  const data = balanceChanges.data;
  // ========================
  // КОНСТАНТИ КОНФІГУРАЦІЇ
  // ========================
  const filterKeys = ["h24", "w1", "m1", "m3", "m6", "y1", "y2"];
  const filterOptions = filterKeys.map((key) => ({
    value: key,
    label: t(`common.filters.short.${key}`)
  }));
  const [activeFilter, setActiveFilter] = useState(filterOptions[1].value);

  // Кольорова схема градієнта
  const gradientColors = {
    start: 'rgba(147, 71, 255, 0.3)', // Фіолетовий з прозорістю
    end: 'rgba(147, 71, 255, 0.05)',   // Більш прозорий фіолетовий
    line: '#9747FF',                   // Основний колір лінії
    lineHover: '#B967FF'               // Колір при наведенні
  };
  const sync = () => {
    if (!dateRange.startDate || !dateRange.endDate) return;

    const startTimestamp = Math.floor((dateRange.startDate).setHours(0, 0, 0, 0) / 1000);
    const endTimestamp = Math.floor((dateRange.endDate).setHours(23, 59, 59, 999) / 1000);
   
    dispatch(fetchBalanceChange({
      id: portfolioId,
      data: {
        fromTs: startTimestamp,
        toTs: endTimestamp,
        pointsCount: 120
      }
    }));
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
        enabled: true,
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(76, 76, 76, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(147, 71, 255, 0.8)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: false,
        callbacks: {
          title: function (tooltipItems) {
            // Отримуємо timestamp для перетворення в повну дату
            const timestamp = tooltipItems[0]?.raw?.timestamp;

            if (!timestamp) return '';
            return formatDate(timestamp);
          },
          label: function(context) {
            const value = context.parsed.y;
            return `USDT ${value.toFixed(2)}`;
          }
        },
        external: function(context) {
          // Кастомне позиціонування tooltip
          const { chart, tooltip } = context;
          if (tooltip.opacity === 0) return;

          // Можна додати кастомну логіку для позиціонування
        }
      },
    },
    scales: {
      y: {
        display: true,
        position: 'left',
         min: 0,
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
          stepSize: 5,
        },
        border: {
          display: false,
        }
      },
    },
    elements: {
      point: {
        radius: 0, // Приховуємо точки по замовчуванню
        hoverRadius: 6,
        hoverBorderWidth: 2,
        hoverBorderColor: '#ffffff',
        hoverBackgroundColor: gradientColors.line,
      },
      line: {
        borderWidth: 2,
        tension: 0.4, // Згладжування ліній
      }
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
  const createGradient = (ctx, chartArea) => {
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0, gradientColors.start);
    gradient.addColorStop(1, gradientColors.end);
    return gradient;
  };

  /**
   * Обробляє дані та створює конфігурацію для діаграми
   */
  const processChartData = () => {
    try {
      let processedData;
      if (data && Array.isArray(data) && data.length > 0) {
        // Обробка реальних даних
        processedData = {
          labels: data.map(item => formatDateLabel(item.ts)),
          values: data.map(item => parseFloat(item.balance) || 0),
          timestamps: data.map(item => item.ts) 
        };
      }else{
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

  // ========================
  // ЕФЕКТИ
  // ========================
    useEffect(() => {
      setActiveFilter(filterOptions[1].value);
    }, [portfolioId]);

  /**
   * Ініціалізація та обробка даних при зміні пропсів
   */
 useEffect(() => {
    if (!dateRange.startDate || !dateRange.endDate) return;

    const startTimestamp = Math.floor((dateRange.startDate).setHours(0, 0, 0, 0) / 1000);
    const endTimestamp = Math.floor((dateRange.endDate).setHours(23, 59, 59, 999) / 1000);
   
    dispatch(fetchBalanceChange({
      id: portfolioId,
      data: {
        fromTs: startTimestamp,
        toTs: endTimestamp,
        pointsCount: 120
      }
    }));

  }, [dateRange.startDate, dateRange.endDate]);

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
  const renderTimeframeButtons = () => (
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

  /**
   * Рендерить основну діаграму
   */
  const renderChart = () => {
    if (isLoading) {
      return (
        <div className={styles.loaderContainer}>
          <Loader text={t("analytics.cost.loading")} />
        </div>
      );
    }

    return (
      <div className={styles.chartContainer}>
        <Line data={chartData} options={chartOptions} />
      </div>
    );
  };

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
  // ========================
  // ОСНОВНИЙ РЕНДЕР
  // ========================
  return (
     <section id={sectionId} ref={(el) => registerRef(sectionId, el)} className={styles.balanceChangesSection}>
        <div className={styles.balanceChangesWrapper}>
          <button className={styles.syncAllButton} onClick={sync}>
            <img className={styles.syncIcon} src={syncIcon} alt="Sync" />
          </button>
          <div className={styles.balanceChanges}>
            <div className={styles.header}>{title}</div>
            {renderChart()}
            {renderTimeframeButtons()}
          </div>
        </div>
      </section>
  );
}