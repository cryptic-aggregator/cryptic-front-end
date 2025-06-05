
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
import Loader from "../../../../components/common/Loader/Loader";
import DateRangePicker from "../../../../components/common/DateRangePicker/DateRangePicker";

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

export default function BalanceChanges({ data, onDateRangeChange   }) {
  // ========================
  // СТАН КОМПОНЕНТА
  // ========================
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("1W");
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  // ========================
  // КОНСТАНТИ КОНФІГУРАЦІЇ
  // ========================
  const filterOptions = ["24H", "1W", "1M", "3M", "6M", "1Y", "2Y"];

  // Кольорова схема градієнта
  const gradientColors = {
    start: 'rgba(147, 71, 255, 0.3)', // Фіолетовий з прозорістю
    end: 'rgba(147, 71, 255, 0.05)',   // Більш прозорий фіолетовий
    line: '#9747FF',                   // Основний колір лінії
    lineHover: '#B967FF'               // Колір при наведенні
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
          title: function(tooltipItems) {
            return tooltipItems[0]?.label || '';
          },
          label: function(context) {
            const value = context.parsed.y;
            return `USDT ${value.toFixed(2)}`;
          },
          afterLabel: function(context) {
            // Додаткова інформація - можна додати дату
            return `${context.label}`;
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
      // Якщо є реальні дані, використовуємо їх
      let processedData;
      
      if (data && Array.isArray(data) && data.length > 0) {
        // Обробка реальних даних
        processedData = {
          labels: data.map(item => item.date || item.label),
          values: data.map(item => parseFloat(item.balance) || parseFloat(item.value) || 0)
        };
      }

      const { labels, values } = processedData;

      setChartData({
        labels,
        datasets: [
          {
            label: 'Balance',
            data: values,
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

  /**
   * Ініціалізація та обробка даних при зміні пропсів
   */
  useEffect(() => {

    if (!dateRange.startDate || !dateRange.endDate ) return;
    onDateRangeChange(dateRange.startDate, dateRange.endDate);
    processChartData()

  }, [data, dateRange.startDate, dateRange.endDate]);


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
            key={option}
            className={`${styles.filterButton} ${
              activeFilter === option ? styles.filterButtonActive : ""
            }`}
            onClick={() => setActiveFilter(option)}
          >
            {option}
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
          <Loader text="Loading balance data..." />
        </div>
      );
    }

    if (!chartData) {
      return (
        <div className={styles.noDataContainer}>
          <span className={styles.noDataText}>No balance data available</span>
        </div>
      );
    }

    return (
      <div className={styles.chartContainer}>
        <Line data={chartData} options={chartOptions} />
      </div>
    );
  };

  // ========================
  // ОСНОВНИЙ РЕНДЕР
  // ========================
  return (
    <div className={styles.balanceChangesWrapper}>
      <div className={styles.balanceChanges}>
        <div className={styles.header}>Balance Changes</div>
        {renderChart()}
        {renderTimeframeButtons()}
      </div>
    </div>
  );
}