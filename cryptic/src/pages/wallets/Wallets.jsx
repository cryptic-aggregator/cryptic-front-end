import styles from "./Wallets.module.css";

import walletIcon from "../../assets/images/Wallets/walletIcon.svg";
import { useTranslation } from 'react-i18next';
import { Line } from "react-chartjs-2"
import { Link,useLocation ,useNavigate,useParams} from "react-router-dom";
import React, { useEffect, useState, useMemo  } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../hooks/useAuth"; // 
import { fetchWallets,changeVisibilityWallet, deleteWallet } from "../../store/slices/walletSlice";
import { useWallet } from "../../hooks/useWallet";
import toast, { Toaster } from 'react-hot-toast';
import i18n from "i18next";

import ethereumIcon from "../../assets/images/Wallets/ethereumIcon.svg";
import bitcoinIcon from "../../assets/images/Wallets/bitcoinIcon.svg";
import solanaIcon from "../../assets/images/Wallets/solanaIcon.svg";
import networkSelect from "../../assets/images/Wallets/networkSelect.svg";
import searchIcon from "../../assets/images/Wallets/search.svg";
import qrCodeIcon from "../../assets/images/Wallets/qrCodeIcon.svg";
import Modal from "../../components/modals/WalletConnect/WalletConnect";
import ModalQRCode from "../../components/modals/QRCodeGenerate/QRCodeGenerate";
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


  const networks = useMemo(() => [
    { value: "", label: t("wallets.toolBar.all"), icon: syncIcon },
    { value: "eth", label: "Ethereum", icon: ethereumIcon },
    { value: "btc", label: "Bitcoin", icon: bitcoinIcon },
    { value: "sol", label: "Solana", icon: solanaIcon },
  ], [i18n.language]);

  const [selectedNetwork, setSelectedNetwork] = useState(networks[0]);

  useEffect(() => {
    setSelectedNetwork(prev => {
      const newType = networks.find(t => t.value === prev.value);
      return newType || networks[0];
    });
  }, [networks]);

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

  const disconnectWallet = (walletId) => {
    dispatch(deleteWallet({
      portfolioId: id,
      walletId: walletId,
    }));
  };


  useEffect(() => {
    if(id){
      dispatch(fetchWallets({
        portfolioId: id,
        search: search,
        networks: selectedNetwork.value,
      })); // Якщо авторизований, отримуємо портфоліо
    
    }
  }, [navigate, dispatch, id, selectedNetwork, search ]);
  
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
  const notify = () => toast.error(t("wallets.toast.errorTransfers"));
  return (
    <>
      {id ? (
          <div ref={ref} className={styles.walletsContent}>
            <div className={`${styles.toolbar} ${widthsState[811] ? styles.narrowToolbar : ''} `}>
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder={t("wallets.toolBar.placeholderSearch")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={styles.searchInput}
                />
                <button className={styles.searchButton}>
                   <img src={searchIcon} alt="Search" className={styles.searchIcon} />
                </button>
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
                <button onClick={() => setModalIsOpen(true)} className={styles.addWalletButton}>{t("wallets.toolBar.buttonAdd")}</button>
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
                            <span className={styles.title}>{t("wallets.table.wallet")}</span>
                            {wallet.network === "eth" &&(
                              <img src={networks[1].icon} alt="Wallet" />
                            )}
                            {wallet.network === "btc" &&(
                              <img src={networks[2].icon} alt="Wallet" />
                            )}
                            {wallet.network === "sol" &&(
                              <img src={networks[3].icon} alt="Wallet" />
                            )}
                          </div>

                          <div className={styles.walletsAddress}>
                            <span className={styles.title}>{t("wallets.table.address")}</span>
                            <span className={styles.address}>{wallet.wallet_address}</span>
                          </div>
                          <div className={styles.walletsType}>
                            <span className={styles.title}>{t("wallets.table.connection.type")}</span>
                            <span className={styles.type}>
                              {{
                                0: t("wallets.table.connection.automatic"),
                                1: t("wallets.table.connection.manual"),
                              }[wallet.connection_type] || t("wallets.table.connection.unknown")}
                            </span>
                          </div>
                          <div className={styles.walletsStatus}>
                            <span className={styles.title}>{t("wallets.table.status.title")}</span>
                            <button
                              onClick={() => toggleVisibility(wallet.id, wallet.visibility)}
                              className={`${wallet.visibility ? styles.switchEnabled : styles.switchDisabled} ${styles.switch}`}
                            >
                              <span
                                className={`${wallet.visibility ? styles.knobEnabled : styles.knobDisabled} ${styles.knob}`}
                              />
                            </button>
                            <span className={styles.statusText}>
                              {wallet.visibility ? t("wallets.table.status.enabled") : t("wallets.table.status.disabled")}
                            </span>
                          </div>
                          <div className={styles.walletsActions}>
                            <button onClick={() => { setModalQRCodeIsOpen(true); setSelectedWallet(wallet) }} className={styles.receiveButton}>
                              <img src={qrCodeIcon} alt="QRCode" />
                              <span>{t("wallets.table.receive")}</span>
                            </button>

                            {wallet.connection_type === 1 ? (
                              <div onClick={notify} className= {`${styles.goToTransferDisabled} ${styles.goToTransfer}`} >
                                {t("wallets.table.transfer")}
                              </div>
                            ) : (
                              <Link to={`/transfer/${wallet.id}`} className={styles.goToTransfer}>
                                {t("wallets.table.transfer")}
                              </Link>
                            )}
                            <button onClick={() => disconnectWallet(wallet.id)} className={styles.disconnect}>{t("wallets.table.disconnect")}</button>
                          </div>
                        </div>
                      
                      </li>
                    ))}
                  </ul>
                  <ModalQRCode isOpen={modalQRCodeIsOpen} network={"Ethereum"} address={selectedWallet?.wallet_address} caip_address={selectedWallet?.caip_address}  onClose={() => setModalQRCodeIsOpen(false)}></ModalQRCode>   
                  
                </div>
              ) : (
                <div className={styles.needSelect}>
                {t("wallets.dataUnavailable")}
                </div>
              )
            )}
          </div>

        ) : (
          <div className={styles.needSelect}>
            {t("wallets.selectPortfolioMessage")}
          </div>
        )
        }
      <Modal isOpen={modalIsOpen} portfolioId={id} onClose={() => setModalIsOpen(false)}></Modal>  

    </>
  );
}