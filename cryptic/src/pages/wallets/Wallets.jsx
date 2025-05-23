import styles from "./Wallets.module.css";

import walletIcon from "../../assets/images/Wallets/walletIcon.svg";
import { useTranslation } from 'react-i18next';
import { Line } from "react-chartjs-2"
import { Link,useLocation ,useNavigate,useParams} from "react-router-dom";
import React, { useEffect, useState, useMemo  } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../hooks/useAuth"; // 
import { fetchWallets,changeVisibilityWallet } from "../../store/slices/walletSlice";
import { useWallet } from "../../hooks/useWallet";
import toast, { Toaster } from 'react-hot-toast';

import ethereumIcon from "../../assets/images/Wallets/ethereumIcon.svg";
import bitcoinIcon from "../../assets/images/Wallets/bitcoinIcon.svg";
import solanaIcon from "../../assets/images/Wallets/solanaIcon.svg";
import networkSelect from "../../assets/images/Wallets/networkSelect.svg";
import qrCodeIcon from "../../assets/images/Wallets/qrCodeIcon.svg";
import Modal from "../../components/Modal/WalletConnectModal/WalletConnectModal";
import ModalQRCode from "../../components/Modal/QRCodeGenerateModal/QRCodeGenerateModal";
import syncIcon from "../../assets/images/Dashboard/syncIcon.svg";
import Loader from '../../components/common/Loader/Loader';
import Error from '../../components/common/Error/Error';
import { useContainerWidth } from "../../hooks/useContainerWidth";

export default function Wallets() {
  const {t} = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuth } = useAuth(); 
  const { listWalletsFromPortfolio, loadingListWalletsFromPortfolio, errorListWalletsFromPortfolio }  = useWallet(); 
  const [coins, setCoins] = useState([]);
  const [totalWorth, setTotalWorth] = useState(0);
  const [search, setSearch] = useState("");
  const [enabled, setEnabled] = useState(1);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalQRCodeIsOpen, setModalQRCodeIsOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null); // Оголошуємо стан для selectedWallet
  const [isOpen, setIsOpen] = useState(false);
  const { ref, widthsState } = useContainerWidth([811, 500]);
  
  const [selectedNetwork, setSelectedNetwork] = useState({
    value: "type",
    label: "All Network",
    icon: syncIcon,
  });
  const networks = [

    { value: "type", label: "All Network", icon: syncIcon },
    { value: "Ethereum", label: "Ethereum", icon: ethereumIcon },
    { value: "Bitcoin", label: "Bitcoin", icon: bitcoinIcon },
    { value: "Solana", label: "Solana", icon: solanaIcon },
  ];

  const handleSelect = (network) => {
    setSelectedNetwork(network);
    setIsOpen(false);
  };

  const toggleVisibility = (walletId, visibility) => {
    dispatch(changeVisibilityWallet({
      portfolioId: id,
      walletId: walletId,
      visibility: { visibility: visibility === 1 ? 0 : 1 }
    }));
  };
  useEffect(() => {
    if (!isAuth) {
      navigate("/signin"); // Якщо не авторизований, перенаправляємо на сторінку входу
    } else if (id) {
      dispatch(fetchWallets(id)); // Якщо авторизований, отримуємо портфоліо
    }
  }, [isAuth, navigate, dispatch, id]);
  
  const sortedWallets = useMemo(() => {
    if(listWalletsFromPortfolio!=null){
      return [...listWalletsFromPortfolio].sort((a, b) => {
        if (a.visibility !== b.visibility) {
          return b.visibility - a.visibility;
        }
        return a.created_at - b.created_at;
      });
    }else{
      return []
    }

  }, [listWalletsFromPortfolio]); // Перерахунок тільки при зміні listWalletsFromPortfolio

  if (!isAuth) {
    return null;  // Якщо не авторизований, нічого не відображається
  }
  const notify = () => toast.error('Transfers are only available for wallets with automatic connection');
  return (
    <>
      {id ? (
          <div ref={ref} className={styles.walletsContent}>
            <div className={`${styles.toolbar} ${widthsState[811] ? styles.narrowToolbar : ''}`}>
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
              <div className={styles.rightContainer}>
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
                <button onClick={() => setModalIsOpen(true)} className={styles.addWalletButton}>Add Wallet</button>
              </div>
            </div>
            {loadingListWalletsFromPortfolio && 
              <div className={styles.Loader}>
                    <Loader />
              </div>
            }
            
            {errorListWalletsFromPortfolio && 
              <div className={styles.Loader}>
                    <Error />
              </div>
            }
            { !errorListWalletsFromPortfolio && !loadingListWalletsFromPortfolio && listWalletsFromPortfolio && (

              sortedWallets.length>0 ? (
                <div className={styles.walletsList}>
                  <ul>
                    {sortedWallets.map(wallet => (
                      <li key={wallet.id} className={styles.walletsListElement}>
                        <div className={styles.walletsListElementWrapper}>
                          <div className={styles.walletsImage}>
                            <span className={styles.title}>Wallet</span>
                            <img src={walletIcon} alt="Wallet" />
                          </div>
                          <div className={styles.walletsAddress}>
                            <span className={styles.title}>Address</span>
                            <span className={styles.address}>{wallet.wallet_address}</span>
                          </div>
                          <div className={styles.walletsType}>
                            <span className={styles.title}>Сonnection type</span>
                            <span className={styles.type}>
                              {{
                                0: 'Automatic',
                                1: 'Manual',
                              }[wallet.connection_type] || 'Unknown'}
                            </span>
                          </div>
                          <div className={styles.walletsStatus}>
                            <span className={styles.title}>Status</span>
                            <button
                              onClick={() => toggleVisibility(wallet.id, wallet.visibility)}
                              className={`${wallet.visibility ? styles.switchEnabled : styles.switchDisabled} ${styles.switch}`}
                            >
                              <span
                                className={`${wallet.visibility ? styles.knobEnabled : styles.knobDisabled} ${styles.knob}`}
                              />
                            </button>
                            <span className={styles.statusText}>
                              {wallet.visibility ? "Wallet Enabled" : "Wallet Disabled"}
                            </span>
                          </div>
                          <div className={styles.walletsActions}>
                            <button onClick={() => { setModalQRCodeIsOpen(true); setSelectedWallet(wallet) }} className={styles.receiveButton}>
                              <img src={qrCodeIcon} alt="QRCode" />
                              <span>Receive</span>
                            </button>

                            {wallet.connection_type === 1 ? (
                              <div onClick={notify} className= {`${styles.goToTransferDisabled} ${styles.goToTransfer}`} >
                                {t('Go to transfer')} 
                              </div>
                            ) : (
                              <Link to={`/transfer/${wallet.id}`} className={styles.goToTransfer}>
                                {t('Go to transfer')}
                              </Link>
                            )}
                            <button className={styles.disconnect}>Disconnect</button>
                          </div>
                        </div>
                      
                      </li>
                    ))}
                  </ul>
                  <ModalQRCode isOpen={modalQRCodeIsOpen} network={"Ethereum"} address={selectedWallet?.wallet_address} onClose={() => setModalQRCodeIsOpen(false)}></ModalQRCode>   
                  
                </div>
              ) : (
                <div className={styles.needSelect}>
                  You don't have any wallets connected yet, but you can easily solve that, just click on the add wallet button
                </div>
              )
            )}
          </div>

        ) : (
          <div className={styles.needSelect}>
            To view the information, you need to select the required portfolio from the list.
          </div>
        )
        }
      <Modal isOpen={modalIsOpen} id={id} onClose={() => setModalIsOpen(false)}></Modal>  

    </>
  );
}