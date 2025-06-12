import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import { LOCALES, DEFAULT_LOCALE } from "./constants.js";
import { uk } from "./locales/uk/index.js";
import { en } from "./locales/en/index.js";

const resources = {
  [LOCALES.EN]: {
    translation: en
  },
  [LOCALES.UK]: {
    translation: uk
  }
};

const isDevelopment = process.env.NODE_ENV === 'development';

i18n
  // Автоматичне визначення мови користувача
  .use(LanguageDetector)
  // Підключення React
  .use(initReactI18next)
  .init({
    resources,
    
    // Мова за замовчуванням
    lng: DEFAULT_LOCALE,
    fallbackLng: DEFAULT_LOCALE,
    
    // Налаштування для розробки
    debug: isDevelopment,
    
    // Не екранувати HTML
    interpolation: {
      escapeValue: false
    },
    
    // Налаштування детектора мови
    detection: {
      // Порядок перевірки мови
      order: ['localStorage', 'navigator', 'htmlTag'],
      // Кешування у localStorage
      caches: ['localStorage'],
      // Ключ для збереження
      lookupLocalStorage: 'i18nextLng'
    },
    
    // Налаштування для відсутніх перекладів
    returnNull: false,
    returnEmptyString: false,
    returnObjects: false,
    
    // Роздільники для вкладених ключів
    keySeparator: '.',
    nsSeparator: ':',
    
    // Налаштування інтерполяції
    interpolation: {
      escapeValue: false,
      formatSeparator: ',',
      format: function(value, format, lng) {
        if (format === 'uppercase') return value.toUpperCase();
        if (format === 'lowercase') return value.toLowerCase();
        if (format === 'capitalize') return value.charAt(0).toUpperCase() + value.slice(1);
        return value;
      }
    }
  });

  export function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }
  export function formatDateLabel(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString(i18n.language, {
      month: 'short',
      day: 'numeric',
    });
  }

export default i18n;