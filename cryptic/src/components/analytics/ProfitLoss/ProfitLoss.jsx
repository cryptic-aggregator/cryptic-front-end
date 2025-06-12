import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { useEffect, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import styles from "./ProfitLoss.module.css";
import Loader from "../../../components/common/Loader/Loader";
import DateRangePicker from "../../../components/common/DateRangePicker/DateRangePicker";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../../lib/i18n";


// Реєструємо необхідні компоненти Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ProfitLoss({ data, title, onDateRangeChange   }) {
  // ========================
  // СТАН КОМПОНЕНТА
  // ========================
  const { t } = useTranslation();
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const selectBoxRef = useRef(null);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
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
        display: false,
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        backgroundColor: '#2D3748',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
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
        position: 'nearest',
        callbacks: {
          title: function(tooltipItems) {
            // Отримуємо timestamp для перетворення в повну дату
            const timestamp = tooltipItems[0]?.raw?.timestamp;
      
            if (!timestamp) return '';
            return formatDate(timestamp);
          },
          label: function(context) {
            return `USDT $${context.parsed.y.toFixed(1)}`;
          }
        }
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12,
            family: 'Inter, sans-serif'
          },
        },
        border: {
          display: false,
        }
      },
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
            return '$' + value;
          },
          stepSize: 2,
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


  /**
   * Обробляє дані та створює конфігурацію для діаграми
   */
   const processChartData = () => {
    try {
      const labels = data.map(item => item.date);
      const values = data.map(item => item.value);
      
      // Створюємо кольори для стовпців (зелені для прибутку, червоні для збитків)
      const backgroundColors = values.map(value => {
        if (value > 0) return '#00C851'; // Зелений для прибутку
        if (value < 0) return '#FF4444'; // Червоний для збитків
        return '#666666'; // Сірий для нуля
      });

      const borderColors = values.map(value => {
        if (value > 0) return '#00C851';
        if (value < 0) return '#FF4444';
        return '#666666';
      });

      setChartData({
        labels,
        datasets: [
          {
            label: 'Profit & Loss',
            data: values,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
            borderRadius: 2,
            borderSkipped: false,
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
        <Bar data={chartData} options={chartOptions} />
      </div>
    );
  };

  // ========================
  // ОСНОВНИЙ РЕНДЕР
  // ========================
  return (
    <div className={styles.balanceChangesWrapper}>
      <div className={styles.balanceChanges}>
        <div className={styles.header}>{title}</div>
        {renderChart()}
        {renderTimeframeButtons()}
      </div>
    </div>
  );
}