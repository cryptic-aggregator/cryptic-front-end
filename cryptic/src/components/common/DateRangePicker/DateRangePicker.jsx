import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import calendarIcon from "../../../assets/images/Transactions/calendar.svg";
import { registerLocale } from "react-datepicker";
import en from "date-fns/locale/en-US";
import uk from "date-fns/locale/uk";
import { useTranslation } from "react-i18next";
// ❌ Не імпортуємо стандартні стилі
import "react-datepicker/dist/react-datepicker.css";
import "./DateRangePickerCustom.css"; // ✅ Підключаємо свої глобальні стилі

export default function DateRangePicker({ activeFilter, onRangeChange }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  registerLocale("en", en);
  registerLocale("uk", uk);
  // коли змінюється активний фільтр — змінюємо діапазон
  useEffect(() => {
    const now = new Date();
    let start = null;

    switch (activeFilter) {
      case "h24":
        start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "w1":
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "m1":
        start = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "m3":
        start = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case "m6":
        start = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case "y1":
        start = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      case "y2":
        start = new Date(now.setFullYear(now.getFullYear() - 2));
        break;
      default:
        return; // якщо custom — нічого не оновлюємо
    }
    start.setHours(0, 0, 0, 0);
    const newEnd = new Date();
    newEnd.setHours(23, 59, 59, 999);
    setStartDate(start);
    setEndDate(newEnd);
    onRangeChange?.({ startDate: start, endDate: newEnd });
  }, [activeFilter]);

  // коли вручну змінюється діапазон — повідомляємо
 const handleChange = ([start, end]) => {
    if (!start) return;
    
    // Створюємо копії дат, щоб не мутувати оригінальні
    const newStart = new Date(start);
    const newEnd = end ? new Date(end) : null;
    
    newStart.setHours(0, 0, 0, 0);
    if (newEnd) {
      newEnd.setHours(23, 59, 59, 999);
    }
    
    setStartDate(newStart);
    setEndDate(newEnd);

    // Викликаємо колбек тільки коли обидві дати вибрані
    if (newStart && newEnd) {
      onRangeChange?.({ startDate: newStart, endDate: newEnd });
    }
  };

  return (
    <div className="datepicker-wrapper">
    <img src={calendarIcon} alt="Calendar" className={`calendar-icon ${activeFilter === "custom" ? "calendar-icon-active" : ""}`}  />
      <DatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={handleChange}
        calendarClassName="custom-calendar"
        wrapperClassName={`custom-input-wrapper ${activeFilter === "custom" ? "custom-input-wrapper-active" : ""}`} 
        dayClassName={() => "custom-day"}
        dateFormat="dd/MM/yyyy"
        locale={currentLang}
      />
    </div>
  );
}
