import styles from "./Transactions.module.css";
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import toast from 'react-hot-toast';

// Імпорт зображень
import network from "../../assets/images/Transactions/network.svg";
import recipient from "../../assets/images/Transactions/recipient.svg";
import sender from "../../assets/images/Transactions/sender.svg";
import networkSelect from "../../assets/images/Wallets/networkSelect.svg";
import receivedIcon from "../../assets/images/AnalyticsPage/receivedIcon.svg";
import transferIcon from "../../assets/images/AnalyticsPage/transferIcon.svg";
import syncIcon from "../../assets/images/Dashboard/syncIcon.svg";
import CopyAlt from "../../assets/images/UserProfile/CopyAlt.svg";

// Імпорт компонентів
import Modal from "../../components/Modal/WalletConnectModal/WalletConnectModal";
import DateRangePicker from "../../components/common/DateRangePicker/DateRangePicker";
import "react-datepicker/dist/react-datepicker.css";

// Імпорт хуків та слайсів
import { fetchTransaction } from "../../store/slices/transactionSlice";
import { useTransaction } from "../../hooks/useTransaction";
import Loader from "../../components/common/Loader/Loader";
import Error from "../../components/common/Error/Error";

export default function Transaction() {
  // ========================
  // ХУКИ ТА БАЗОВІ ЗМІННІ
  // ========================
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const scrollContainerRef = useRef(null);

  // ========================
  // КОНСТАНТИ КОНФІГУРАЦІЇ
  // ========================
  const ITEMS_PER_PAGE = 5;
  const SCROLL_THRESHOLD = 100;
  
  const filterOptions = ["24H", "1W", "1M", "3M", "6M", "1Y", "2Y"];
  
  const transactionTypes = [
    { value: 0, label: "All Transaction Type", icon: syncIcon },
    { value: 1, label: "Received", icon: receivedIcon },
    { value: 2, label: "Sent", icon: transferIcon },
  ];
  
  const displayTransactionTypes = [
    { value: 0, label: "Received", icon: receivedIcon },
    { value: 1, label: "Sent", icon: transferIcon },
  ];

  // ========================
  // СТАН КОМПОНЕНТА
  // ========================
  
  // Стан для фільтрації та пошуку
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("1W");
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [selectedType, setSelectedType] = useState({
    value: 0,
    label: "All Transaction Type",
    icon: syncIcon,
  });

  // Стан для UI та модалів
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Стан для пагінації та завантаження
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  // Стан для даних
  const [groupedTransactions, setGroupedTransactions] = useState({});
  const [expandedFields, setExpandedFields] = useState(new Set());

  // Отримання даних з хука
  const { 
    listTransactionFromPortfolio, 
    loadingListTransactionFromPortfolio, 
    errorListTransactionFromPortfolio 
  } = useTransaction();

  // ========================
  // ДОПОМІЖНІ ФУНКЦІЇ
  // ========================
  
  /**
   * Скорочує адресу для відображення
   * @param {string} address - Повна адреса
   * @returns {string} Скорочена адреса
   */
  const shortenAddress = (address) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "N/A";
  };

  /**
   * Копіює адресу в буфер обміну
   * @param {string} address - Адреса для копіювання
   */
  const copyToClipboard = (address) => {
    if (address) {
      navigator.clipboard.writeText(address)
        .then(() => toast.success('Copied to clipboard!'))
        .catch((err) => toast.error("Failed to copy: ", err));
    }
  };

  /**
   * Перемикає розширене відображення поля
   * @param {string} txId - ID транзакції
   * @param {string} field - Назва поля
   */
  const toggleExpandedField = (txId, field) => {
    const key = `${txId}_${field}`;
    setExpandedFields((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  /**
   * Обробляє вибір типу транзакції
   * @param {Object} type - Об'єкт типу транзакції
   */
  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setIsDropdownOpen(false);
  };

  // ========================
  // ЕФЕКТИ
  // ========================

  /**
   * Оновлює стан hasMore на основі загальної кількості та завантажених елементів
   */
  useEffect(() => {
    const total = listTransactionFromPortfolio?.total || 0;
    const currentLoaded = page * ITEMS_PER_PAGE;
    setHasMore(currentLoaded < total);
  }, [listTransactionFromPortfolio?.total, page]);

  /**
   * Завантажує транзакції при зміні параметрів
   */
  useEffect(() => {
    if (!id || !dateRange.startDate || !dateRange.endDate || !hasMore) return;

    const getTransactions = async () => {
      try {
        setIsLoadingMore(true);
        await dispatch(fetchTransaction({
          id,
          data: {
            Page: page,
            PerPage: ITEMS_PER_PAGE,
            TransactionType: selectedType.value,
            DateFrom: Math.floor(new Date(dateRange.startDate.setHours(0, 0, 0, 0)) / 1000),
            DateTo: Math.floor(new Date(dateRange.endDate.setHours(23, 59, 59, 999)) / 1000),
          },
        }));
      } catch (error) {
        console.error("Помилка при отриманні транзакцій:", error);
        toast.error("Failed to load transactions");
      } finally {
        setIsLoadingMore(false);
      }
    };

    getTransactions();
  }, [id, selectedType.value, dateRange.startDate, dateRange.endDate, page, hasMore, dispatch]);

  /**
   * Обробляє скрол для нескінченного завантаження
   */
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !hasMore) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD && !isLoadingMore) {
        setPage((prev) => prev + 1);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoadingMore]);

  /**
   * Групує транзакції за датами
   */
  useEffect(() => {
    if (!listTransactionFromPortfolio?.transactions) return;

    const grouped = {};
    
    listTransactionFromPortfolio.transactions.forEach((tx) => {
      const dateKey = new Date(tx.timestamp * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const txWithShortAddresses = {
        ...tx,
        shortFromAddress: shortenAddress(tx.from_address),
        shortToAddress: shortenAddress(tx.to_address),
      };

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }

      grouped[dateKey].push(txWithShortAddresses);
    });

    setGroupedTransactions((prev) => {
      const updated = { ...prev };
      Object.entries(grouped).forEach(([key, txs]) => {
        if (!updated[key]) updated[key] = [];
        updated[key] = [
          ...updated[key],
          ...txs.filter(
            (tx) => !updated[key].some((existingTx) => existingTx.transaction_id === tx.transaction_id)
          ),
        ];
      });
      return updated;
    });
  }, [listTransactionFromPortfolio]);

  /**
   * Скидає стан при зміні фільтрів
   */
  useEffect(() => {
    setPage(1);
    setGroupedTransactions({});
    setHasMore(true);
  }, [selectedType, dateRange, search, id]);

  // ========================
  // КОМПОНЕНТИ РЕНДЕРИНГУ
  // ========================

  /**
   * Рендерить панель інструментів з фільтрами
   */
  const renderToolbar = () => (
    <div className={styles.toolbar}>
      {/* Ліва частина з пошуком та селектором типу */}
      <div className={styles.leftContainer}>
        {/* Поле пошуку */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          <button className={styles.searchButton}>🔍</button>
        </div>

        {/* Селектор типу транзакцій */}
        <div className={styles.networkSelector}>
          <div 
            className={styles.selectBox} 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <img 
              src={selectedType.icon} 
              alt={selectedType.label} 
              className={styles.icon} 
            />
            <span>{selectedType.label}</span>
            <img 
              src={networkSelect} 
              alt="Select dropdown" 
              className={styles.networkSelectIcon} 
            />
          </div>
          
          {isDropdownOpen && (
            <div className={styles.dropdown}>
              {transactionTypes.map((type) => (
                <div
                  key={type.value}
                  className={styles.option}
                  onClick={() => handleTypeSelect(type)}
                >
                  <img 
                    src={type.icon} 
                    alt={type.label} 
                    className={styles.icon} 
                  />
                  <span>{type.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Права частина з фільтрами часу */}
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
        
        {/* Кастомний селектор дат */}
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
    </div>
  );

  /**
   * Рендерить деталі окремої транзакції
   * @param {Object} tx - Об'єкт транзакції
   * @param {number} index - Індекс транзакції
   */
  const renderTransactionDetails = (tx, index) => (
    <div key={tx.transaction_id || index} className={styles.transactionsListElementWrapper}>
      {/* Тип транзакції */}
      <div className={styles.transactionsType}>
        <span className={styles.title}>Type</span>
        <div className={styles.typeContainer}>
          <img 
            loading="lazy" 
            src={displayTransactionTypes[tx.transaction_type]?.icon} 
            alt="Transaction type" 
          />
          <span className={styles.type}>
            {displayTransactionTypes[tx.transaction_type]?.label}
          </span>
        </div>
      </div>

      {/* Активи */}
      <div className={styles.transactionsAsset}>
        <span className={styles.title}>Asset(s)</span>
        <div className={styles.assetContainer}>
          <img 
            loading="lazy" 
            src={tx.token?.logo_uri} 
            alt="Token logo" 
          />
          <div className={styles.blanceChange}>
            <span className={styles.asset}>
              {Number(tx.amount) + Number(tx.fee)} {tx.token?.symbol}
            </span>
            <span className={styles.balance}>
              {Number(tx.amount)}
            </span>
          </div>
        </div>
      </div>

      {/* Адреса відправника */}
      <div className={styles.transactionsRecipient}>
        <span className={styles.title}>From</span>
        <div className={styles.recipientContainer}>
          <img loading="lazy" src={sender} alt="Sender" />
          <span
            title={tx.from_address}
            className={styles.address}
            onClick={() => toggleExpandedField(tx.transaction_id, "from")}
            style={{ cursor: "pointer" }}
          >
            {expandedFields.has(`${tx.transaction_id}_from`)
              ? tx.from_address
              : tx.shortFromAddress}
          </span>
          <img
            className={styles.copyIcon}
            src={CopyAlt}
            alt="Copy to clipboard"
            onClick={() => copyToClipboard(tx.from_address)}
          />
        </div>
      </div>

      {/* Адреса отримувача */}
      <div className={styles.transactionsRecipient}>
        <span className={styles.title}>To</span>
        <div className={styles.recipientContainer}>
          <img loading="lazy" src={recipient} alt="Recipient" />
          <span
            title={tx.to_address}
            className={styles.address}
            onClick={() => toggleExpandedField(tx.transaction_id, "to")}
            style={{ cursor: "pointer" }}
          >
            {expandedFields.has(`${tx.transaction_id}_to`)
              ? tx.to_address
              : tx.shortToAddress}
          </span>
          <img
            className={styles.copyIcon}
            src={CopyAlt}
            alt="Copy to clipboard"
            onClick={() => copyToClipboard(tx.to_address)}
          />
        </div>
      </div>

      {/* Мережа */}
      <div className={styles.transactionsNetwork}>
        <span className={styles.title}>Network</span>
        <div className={styles.networkContainer}>
          <img loading="lazy" src={network} alt="Network" />
          <span className={styles.network}>{tx.chain}</span>
        </div>
      </div>
    </div>
  );

  /**
   * Рендерить список транзакцій
   */
  const renderTransactionsList = () => (
    <div ref={scrollContainerRef} className={styles.transactionsList}>
      <ul>
        {Object.entries(groupedTransactions).map(([date, transactions], index) => (
          <li key={index} className={styles.transactionsListElement}>
            <span className={styles.transactionsDate}>{date}</span>
            <div className={styles.transactionsInfo}>
              {transactions.map((tx, i) => renderTransactionDetails(tx, i))}
            </div>
          </li>
        ))}
        
        {/* Індикатор завантаження */}
        {isLoadingMore && (
          <div className={styles.Loader}>
            <Loader/>
          </div>
        )}
      </ul>
    </div>
  );

  /**
   * Рендерить стан
   */
  const renderEmptyState = () => (
    <div className={styles.needSelect}>
      Unfortunately, no transactions were found for the selected portfolio.
    </div>
  );

  const renderErrorState = () => (
    <div className={styles.Loader}>
      <Error/>
    </div>
  );

  const renderSelectPortfolioMessage = () => (
    <div className={styles.needSelect}>
      To view the information, you need to select the required portfolio from the list.
    </div>
  );

  // ========================
  // ОСНОВНИЙ РЕНДЕР
  // ========================
  
  // Якщо немає ID портфоліо
  if (!id) {
    return renderSelectPortfolioMessage();
  }

  return (
    <>
      <div className={styles.transactionsContent}>

        {renderToolbar()}

        {errorListTransactionFromPortfolio ? (
          renderErrorState()
        ) : listTransactionFromPortfolio?.transactions.length > 0 ? (
          renderTransactionsList()
        ) : (
          renderEmptyState()
        )}

      </div>

      <Modal 
        isOpen={modalIsOpen} 
        id={id} 
        onClose={() => setModalIsOpen(false)} 
      />
    </>
  );
}