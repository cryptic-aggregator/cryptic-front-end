import styles from "./QRCodeGenerateModal.module.css";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import close from "../../../assets/images/PortfoliosCreateModals/close.svg";
import { QRCodeCanvas } from "qrcode.react";
import CopyAlt from "../../../assets/images/UserProfile/CopyAlt.svg";

export default function QRCodeGenerateModal({ isOpen, onClose, address, network}) {
  const { t } = useTranslation();
  const secretKeyRef = useRef(null);
  const navigate = useNavigate();
  const { isAuth } = useAuth();

  let uri = "";

  switch (network) {
    case "Bitcoin":
      uri = `bitcoin:${address}`;
      break;
    case "Ethereum":
      uri = `ethereum:${address}`;
      break;
    case "Solana":
      uri = `solana:${address}`;
      break;
    default:
      uri = address; // Якщо інша валюта, просто виводимо адресу
  }

  useEffect(() => {
    if (!isAuth) {
      navigate("/signin");
    }
  }, [isAuth, navigate]);

  const copyToClipboard = () => {
    if (secretKeyRef.current) {
      const text = secretKeyRef.current.innerText.trim();
      navigator.clipboard.writeText(text)
        .then(() => console.log("Copied to clipboard!"))
        .catch((err) => console.error("Failed to copy: ", err));
    }
  };
  const onModalClick = (event) => {
    if (event.target.classList.contains(styles.modalWrapper)) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
            <div className={styles.modalWrapper} onClick={onModalClick}>
              <div className={styles.connectWalletContainer}>
                <div className={styles.connectWalletContainerWrapper}>
                    <button className={styles.closeButton} onClick={onClose}>
                    <img src={close} alt="Close" />
                    </button>
                    <div className={styles.card}>
                        <h3>Scan to Send</h3>
                        <QRCodeCanvas 
                        bgColor={"transparent"}
                        fgColor={"#FFFFFFFF"}
                        value={uri} size={200} />
                        <div className={styles.secretKey} ref={secretKeyRef}>
                            {address}
                            <img className={styles.copyIcon} src={CopyAlt} alt="Copy to clipboard" onClick={copyToClipboard}/>
                        </div>

                    </div>

                </div>
              </div>
            </div>
      )}
    </>
  );
}
