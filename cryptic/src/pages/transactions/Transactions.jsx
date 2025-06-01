import styles from "./Transactions.module.css";

import currencyImg from "../../assets/images/Dashboard/currencyImg.svg";
import openIcon from "../../assets/images/Dashboard/openIcon.svg";
import walletIcon from "../../assets/images/Wallets/walletIcon.svg";
import { useTranslation } from 'react-i18next';
import { Line } from "react-chartjs-2"
import { Link,useLocation ,useNavigate,useParams} from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../hooks/useAuth"; // 
import { useWallet } from "../../hooks/useWallet";

import asset from "../../assets/images/Transactions/asset.svg";
import network from "../../assets/images/Transactions/network.svg";
import received from "../../assets/images/Transactions/received.svg";
import sent from "../../assets/images/Transactions/sent.svg";
import recipient from "../../assets/images/Transactions/recipient.svg";

import networkSelect from "../../assets/images/Wallets/networkSelect.svg";
import qrCodeIcon from "../../assets/images/Wallets/qrCodeIcon.svg";
import receivedIcon from "../../assets/images/AnalyticsPage/receivedIcon.svg";
import transferIcon from "../../assets/images/AnalyticsPage/transferIcon.svg";
import syncIcon from "../../assets/images/Dashboard/syncIcon.svg";
import Modal from "../../components/Modal/WalletConnectModal/WalletConnectModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DateRangePicker from "../../components/common/DateRangePicker/DateRangePicker";
import MainNavbar from "../../components/navigation/MainNavbar/MainNavbar";

export default function Dashboard() {
  const {t} = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuth } = useAuth(); 
  const today = new Date();
const address = "0x9eb4878F60eA745AEB7ECfDad46DDd01B07bD3CE";
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    const monthAgo = new Date();
    monthAgo.setMonth(today.getMonth() - 1);
    return monthAgo;
  });
  const [endDate, setEndDate] = useState(new Date());
const [dateRange, setDateRange] = useState({
  startDate: null,
  endDate: null,
});
  const [activeFilter, setActiveFilter] = useState("1W"); 
  const filterOptions = ["24H", "1W", "1M", "3M", "6M", "1Y", "ALL"];
  const { listWalletsFromPortfolio, loadingListWalletsFromPortfolio, errorListWalletsFromPortfolio }  = useWallet(); 
  const [coins, setCoins] = useState([]);
  const [totalWorth, setTotalWorth] = useState(0);
  const [search, setSearch] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState({
    value: "type",
    label: "All Transaction Type",
    icon: syncIcon,
  });
  const networks = [
    { value: "type", label: "All Transaction Type", icon: syncIcon },
    { value: "Sent", label: "Sent", icon: transferIcon },
    { value: "Received", label: "Received", icon: receivedIcon },

  ];
  const handleSelect = (network) => {
    setSelectedNetwork(network);
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isAuth) {
      navigate("/signin"); // Якщо не авторизований, перенаправляємо на сторінку входу
    } 
  }, [isAuth, navigate, dispatch, id]);
  

  
  if (!isAuth) {
    return null;  // Якщо не авторизований, нічого не відображається
  }

  return (
    <>
      {id ? (
          <>
            {false && <p>Loading...</p>}
            {false && <p className={styles.error}>Error: {errorListWalletsFromPortfolio}</p>}
            
            {true && (
              <>
                <div className={styles.transactionsContent}>
                  <div className={styles.toolbar}>
                    <div className={styles.leftContainer }>
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
                      <div className={styles.networkSelector}>

                          <div className={styles.selectBox} onClick={() => setIsOpen(!isOpen)}>
                            <img src={selectedNetwork.icon} alt={selectedNetwork.label} className={styles.icon} />
                            <span>{selectedNetwork.label}</span>
                            <img src={networkSelect} alt="networkSelectIcon" className={styles.networkSelectIcon} />
                          </div>

                          {isOpen && (
                            <div className={styles.dropdown}>
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
                    </div>
                     <div className={styles.filterContainer}>
                      {filterOptions.map((option) => (
                        <button
                          key={option}
                          className={`${styles.filterButton} ${activeFilter === option ? styles.filterButtonActive : ""}`}
                          onClick={() => setActiveFilter(option)}
                        >
                          {option}
                        </button>
                      ))}

                      <button
                        className={`${styles.filterButton} ${activeFilter === `custom` ? styles.filterButtonActive : ""}`}
                        onClick={() => setActiveFilter("custom")}
                      >
                        <DateRangePicker
                          activeFilter={activeFilter}
                          onRangeChange={(range) => {
                            setDateRange(range);

                          }}
                        />
                      </button>
                    </div>
                  </div>
                  <div className={styles.transactionsList}>
                    <ul>
                      <li className={styles.transactionsListElement}>
                          <span className={styles.transactionsDate}> August 4, 2024 </span>
                          <div className={styles.transactionsInfo}>

                            <div className={styles.transactionsListElementWrapper}>

                              <div className={styles.transactionsType}>
                                <span className={styles.title}>Type</span>
                                <div  className={styles.typeContainer}>
                                  <img src={sent} alt="Type" />
                                  <span className={styles.type}>Sent</span>
                                </div>
                                
                              </div>

                              <div className={styles.transactionsAsset}>
                                <span className={styles.title}>Asset(s)</span>
                                <div className={styles.assetContainer}>
                                  <img src={asset} alt="Asset" />
                                  <div className={styles.blanceChange}>
                                    <span className={styles.asset}>-27.89 USDT</span>
                                    <span className={styles.balance}>$28.54</span>
                                  </div>
                                </div>
                              </div>

                              <div className={styles.transactionsRecipient}>
                                <span className={styles.title}>To</span>
                                <div  className={styles.recipientContainer}>
                                  <img src={recipient} alt="Recipient" />
                                  <span className={styles.address}>{address.slice(0, 6)}...${address.slice(-4)}</span>
                                </div>
                              </div>

                              <div className={styles.transactionsCurrentValue}>
                                <span className={styles.title}>Current Value</span>
                                <div  className={styles.currentValueContainer}>
                                  <span className={styles.value}>156.54 USDT</span>
                                </div>

                              </div>

                              <div className={styles.transactionsNetwork}>
                                <span className={styles.title}>Network</span>
                                <div  className={styles.networkContainer}>
                                  <img src={network} alt="Network" />
                                  <span className={styles.network}>Ethereum</span>
                                </div>
                              </div>

                            </div>

                            <div className={styles.transactionsListElementWrapper}>

                              <div className={styles.transactionsType}>
                                <span className={styles.title}>Type</span>
                                <div  className={styles.typeContainer}>
                                  <img src={sent} alt="Type" />
                                  <span className={styles.type}>Sent</span>
                                </div>
                                
                              </div>

                              <div className={styles.transactionsAsset}>
                                <span className={styles.title}>Asset(s)</span>
                                <div className={styles.assetContainer}>
                                  <img src={asset} alt="Asset" />
                                  <div className={styles.blanceChange}>
                                    <span className={styles.asset}>-27.89 USDT</span>
                                    <span className={styles.balance}>$28.54</span>
                                  </div>
                                </div>
                              </div>

                              <div className={styles.transactionsRecipient}>
                                <span className={styles.title}>To</span>
                                <div  className={styles.recipientContainer}>
                                  <img src={recipient} alt="Recipient" />
                                  <span className={styles.address}>{address.slice(0, 6)}...${address.slice(-4)}</span>
                                </div>
                              </div>

                              <div className={styles.transactionsCurrentValue}>
                                <span className={styles.title}>Current Value</span>
                                <div  className={styles.currentValueContainer}>
                                  <span className={styles.value}>156.54 USDT</span>
                                </div>

                              </div>

                              <div className={styles.transactionsNetwork}>
                                <span className={styles.title}>Network</span>
                                <div  className={styles.networkContainer}>
                                  <img src={network} alt="Network" />
                                  <span className={styles.network}>Ethereum</span>
                                </div>
                              </div>

                            </div>

                          </div>
                      </li>
                      <li className={styles.transactionsListElement}>
                          <span className={styles.transactionsDate}> August 4, 2024 </span>
                          <div className={styles.transactionsInfo}>

                            <div className={styles.transactionsListElementWrapper}>

                              <div className={styles.transactionsType}>
                                <span className={styles.title}>Type</span>
                                <div  className={styles.typeContainer}>
                                  <img src={sent} alt="Type" />
                                  <span className={styles.type}>Sent</span>
                                </div>
                                
                              </div>

                              <div className={styles.transactionsAsset}>
                                <span className={styles.title}>Asset(s)</span>
                                <div className={styles.assetContainer}>
                                  <img src={asset} alt="Asset" />
                                  <div className={styles.blanceChange}>
                                    <span className={styles.asset}>-27.89 USDT</span>
                                    <span className={styles.balance}>$28.54</span>
                                  </div>
                                </div>
                              </div>

                              <div className={styles.transactionsRecipient}>
                                <span className={styles.title}>To</span>
                                <div  className={styles.recipientContainer}>
                                  <img src={recipient} alt="Recipient" />
                                  <span className={styles.address}>{address.slice(0, 6)}...${address.slice(-4)}</span>
                                </div>
                              </div>

                              <div className={styles.transactionsCurrentValue}>
                                <span className={styles.title}>Current Value</span>
                                <div  className={styles.currentValueContainer}>
                                  <span className={styles.value}>156.54 USDT</span>
                                </div>

                              </div>

                              <div className={styles.transactionsNetwork}>
                                <span className={styles.title}>Network</span>
                                <div  className={styles.networkContainer}>
                                  <img src={network} alt="Network" />
                                  <span className={styles.network}>Ethereum</span>
                                </div>
                              </div>

                            </div>

                            <div className={styles.transactionsListElementWrapper}>

                              <div className={styles.transactionsType}>
                                <span className={styles.title}>Type</span>
                                <div  className={styles.typeContainer}>
                                  <img src={sent} alt="Type" />
                                  <span className={styles.type}>Sent</span>
                                </div>
                                
                              </div>

                              <div className={styles.transactionsAsset}>
                                <span className={styles.title}>Asset(s)</span>
                                <div className={styles.assetContainer}>
                                  <img src={asset} alt="Asset" />
                                  <div className={styles.blanceChange}>
                                    <span className={styles.asset}>-27.89 USDT</span>
                                    <span className={styles.balance}>$28.54</span>
                                  </div>
                                </div>
                              </div>

                              <div className={styles.transactionsRecipient}>
                                <span className={styles.title}>To</span>
                                <div  className={styles.recipientContainer}>
                                  <img src={recipient} alt="Recipient" />
                                  <span className={styles.address}>{address.slice(0, 6)}...${address.slice(-4)}</span>
                                </div>
                              </div>

                              <div className={styles.transactionsCurrentValue}>
                                <span className={styles.title}>Current Value</span>
                                <div  className={styles.currentValueContainer}>
                                  <span className={styles.value}>156.54 USDT</span>
                                </div>

                              </div>

                              <div className={styles.transactionsNetwork}>
                                <span className={styles.title}>Network</span>
                                <div  className={styles.networkContainer}>
                                  <img src={network} alt="Network" />
                                  <span className={styles.network}>Ethereum</span>
                                </div>
                              </div>

                            </div>

                          </div>
                      </li>
                      <li className={styles.transactionsListElement}>
                          <span className={styles.transactionsDate}> August 4, 2024 </span>
                          <div className={styles.transactionsInfo}>

                            <div className={styles.transactionsListElementWrapper}>

                              <div className={styles.transactionsType}>
                                <span className={styles.title}>Type</span>
                                <div  className={styles.typeContainer}>
                                  <img src={sent} alt="Type" />
                                  <span className={styles.type}>Sent</span>
                                </div>
                                
                              </div>

                              <div className={styles.transactionsAsset}>
                                <span className={styles.title}>Asset(s)</span>
                                <div className={styles.assetContainer}>
                                  <img src={asset} alt="Asset" />
                                  <div className={styles.blanceChange}>
                                    <span className={styles.asset}>-27.89 USDT</span>
                                    <span className={styles.balance}>$28.54</span>
                                  </div>
                                </div>
                              </div>

                              <div className={styles.transactionsRecipient}>
                                <span className={styles.title}>To</span>
                                <div  className={styles.recipientContainer}>
                                  <img src={recipient} alt="Recipient" />
                                  <span className={styles.address}>{address.slice(0, 6)}...${address.slice(-4)}</span>
                                </div>
                              </div>

                              <div className={styles.transactionsCurrentValue}>
                                <span className={styles.title}>Current Value</span>
                                <div  className={styles.currentValueContainer}>
                                  <span className={styles.value}>156.54 USDT</span>
                                </div>

                              </div>

                              <div className={styles.transactionsNetwork}>
                                <span className={styles.title}>Network</span>
                                <div  className={styles.networkContainer}>
                                  <img src={network} alt="Network" />
                                  <span className={styles.network}>Ethereum</span>
                                </div>
                              </div>

                            </div>

                            <div className={styles.transactionsListElementWrapper}>

                              <div className={styles.transactionsType}>
                                <span className={styles.title}>Type</span>
                                <div  className={styles.typeContainer}>
                                  <img src={sent} alt="Type" />
                                  <span className={styles.type}>Sent</span>
                                </div>
                                
                              </div>

                              <div className={styles.transactionsAsset}>
                                <span className={styles.title}>Asset(s)</span>
                                <div className={styles.assetContainer}>
                                  <img src={asset} alt="Asset" />
                                  <div className={styles.blanceChange}>
                                    <span className={styles.asset}>-27.89 USDT</span>
                                    <span className={styles.balance}>$28.54</span>
                                  </div>
                                </div>
                              </div>

                              <div className={styles.transactionsRecipient}>
                                <span className={styles.title}>To</span>
                                <div  className={styles.recipientContainer}>
                                  <img src={recipient} alt="Recipient" />
                                  <span className={styles.address}>{address.slice(0, 6)}...${address.slice(-4)}</span>
                                </div>
                              </div>

                              <div className={styles.transactionsCurrentValue}>
                                <span className={styles.title}>Current Value</span>
                                <div  className={styles.currentValueContainer}>
                                  <span className={styles.value}>156.54 USDT</span>
                                </div>

                              </div>

                              <div className={styles.transactionsNetwork}>
                                <span className={styles.title}>Network</span>
                                <div  className={styles.networkContainer}>
                                  <img src={network} alt="Network" />
                                  <span className={styles.network}>Ethereum</span>
                                </div>
                              </div>

                            </div>

                          </div>
                      </li>
                                            <li className={styles.transactionsListElement}>
                          <span className={styles.transactionsDate}> August 4, 2024 </span>
                          <div className={styles.transactionsInfo}>

                            <div className={styles.transactionsListElementWrapper}>

                              <div className={styles.transactionsType}>
                                <span className={styles.title}>Type</span>
                                <div  className={styles.typeContainer}>
                                  <img src={sent} alt="Type" />
                                  <span className={styles.type}>Sent</span>
                                </div>
                                
                              </div>

                              <div className={styles.transactionsAsset}>
                                <span className={styles.title}>Asset(s)</span>
                                <div className={styles.assetContainer}>
                                  <img src={asset} alt="Asset" />
                                  <div className={styles.blanceChange}>
                                    <span className={styles.asset}>-27.89 USDT</span>
                                    <span className={styles.balance}>$28.54</span>
                                  </div>
                                </div>
                              </div>

                              <div className={styles.transactionsRecipient}>
                                <span className={styles.title}>To</span>
                                <div  className={styles.recipientContainer}>
                                  <img src={recipient} alt="Recipient" />
                                  <span className={styles.address}>{address.slice(0, 6)}...${address.slice(-4)}</span>
                                </div>
                              </div>

                              <div className={styles.transactionsCurrentValue}>
                                <span className={styles.title}>Current Value</span>
                                <div  className={styles.currentValueContainer}>
                                  <span className={styles.value}>156.54 USDT</span>
                                </div>

                              </div>

                              <div className={styles.transactionsNetwork}>
                                <span className={styles.title}>Network</span>
                                <div  className={styles.networkContainer}>
                                  <img src={network} alt="Network" />
                                  <span className={styles.network}>Ethereum</span>
                                </div>
                              </div>

                            </div>

                            <div className={styles.transactionsListElementWrapper}>

                              <div className={styles.transactionsType}>
                                <span className={styles.title}>Type</span>
                                <div  className={styles.typeContainer}>
                                  <img src={sent} alt="Type" />
                                  <span className={styles.type}>Sent</span>
                                </div>
                                
                              </div>

                              <div className={styles.transactionsAsset}>
                                <span className={styles.title}>Asset(s)</span>
                                <div className={styles.assetContainer}>
                                  <img src={asset} alt="Asset" />
                                  <div className={styles.blanceChange}>
                                    <span className={styles.asset}>-27.89 USDT</span>
                                    <span className={styles.balance}>$28.54</span>
                                  </div>
                                </div>
                              </div>

                              <div className={styles.transactionsRecipient}>
                                <span className={styles.title}>To</span>
                                <div  className={styles.recipientContainer}>
                                  <img src={recipient} alt="Recipient" />
                                  <span className={styles.address}>{address.slice(0, 6)}...${address.slice(-4)}</span>
                                </div>
                              </div>

                              <div className={styles.transactionsCurrentValue}>
                                <span className={styles.title}>Current Value</span>
                                <div  className={styles.currentValueContainer}>
                                  <span className={styles.value}>156.54 USDT</span>
                                </div>

                              </div>

                              <div className={styles.transactionsNetwork}>
                                <span className={styles.title}>Network</span>
                                <div  className={styles.networkContainer}>
                                  <img src={network} alt="Network" />
                                  <span className={styles.network}>Ethereum</span>
                                </div>
                              </div>

                            </div>

                          </div>
                      </li>
                    </ul>
                  </div>

                </div>
                <Modal isOpen={modalIsOpen} id={id} onClose={() => setModalIsOpen(false)}></Modal>   
              </>
            )}
          </>
        ) : (
          <div className={styles.needSelect}>
            To view the information, you need to select the required portfolio from the list.
          </div>
        )

      }
    </>
  );
}