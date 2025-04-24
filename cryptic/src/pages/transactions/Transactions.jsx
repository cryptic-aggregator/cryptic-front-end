import styles from "./Transactions.module.css";

import currencyImg from "../../assets/images/Dashboard/currencyImg.svg";
import openIcon from "../../assets/images/Dashboard/openIcon.svg";
import assetsIcon from "../../assets/images/Dashboard/assetsIcon.svg";
import walletIcon from "../../assets/images/Wallets/walletIcon.svg";
import { useTranslation } from 'react-i18next';
import { Line } from "react-chartjs-2"
import { Link,useLocation ,useNavigate,useParams} from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../hooks/useAuth"; // 
import { useWallet } from "../../hooks/useWallet";

import ethereumIcon from "../../assets/images/Wallets/ethereumIcon.svg";
import bitcoinIcon from "../../assets/images/Wallets/bitcoinIcon.svg";
import solanaIcon from "../../assets/images/Wallets/solanaIcon.svg";
import networkSelect from "../../assets/images/Wallets/networkSelect.svg";
import qrCodeIcon from "../../assets/images/Wallets/qrCodeIcon.svg";
import receivedIcon from "../../assets/images/AnalyticsPage/receivedIcon.svg";
import transferIcon from "../../assets/images/AnalyticsPage/transferIcon.svg";
import syncIcon from "../../assets/images/Dashboard/syncIcon.svg";
import Modal from "../../components/Modal/WalletConnectModal/WalletConnectModal";
export default function Dashboard() {
  const {t} = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuth } = useAuth(); 
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
                <div className={styles.walletsContent}>
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
                  <button onClick={() => setModalIsOpen(true)} className={styles.addWalletButton}>Add Wallet</button>
                  </div>
                  <div className={styles.walletsList}>
                    <ul>
                      <li className={styles.walletsListElement}>
                        <div className={styles.walletsListElementWrapper}>
                          <div className={styles.walletsImage}>
                            <span className={styles.title}>Wallet</span>
                            <img src={walletIcon} alt="Wallet" />
                          </div>
                          <div className={styles.walletsAddress}>
                            <span className={styles.title}>Address</span>
                            <span className={styles.address}>0xb56D4902aA6C455c3D06555080B9512703e88FE2</span>
                          </div>
                          <div className={styles.walletsStatus}>
                            <span className={styles.title}>Status</span>
                            <button
                              onClick={() => setEnabled(!enabled)}
                              className={`${enabled ? styles.switchEnabled : styles.switchDisabled} ${styles.switch}`}
                            >
                              <span
                                className={`${enabled ? styles.knobEnabled : styles.knobDisabled} ${styles.knob}`}
                              />
                            </button>
                            <span className={styles.statusText}>
                              {enabled ? "Wallet Enabled" : "Wallet Disabled"}
                            </span>
                          </div>
                          <div className={styles.walletsActions}>
                            <button className={styles.receiveButton}>
                              <img src={qrCodeIcon} alt="QRCode" />
                              <span>Receive</span>
                            </button>
                            <Link className={styles.goToTransfer} href="#">Go to transfer</Link>
                            <button className={styles.disconnect}>Disconnect</button>
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