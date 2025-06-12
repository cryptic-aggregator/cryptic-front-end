import styles from "./QRCodeGenerate.module.css";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import close from "../../../assets/images/PortfoliosCreateModals/close.svg";
import { QRCodeCanvas } from "qrcode.react";
import CopyAlt from "../../../assets/images/UserProfile/CopyAlt.svg";
import toast from 'react-hot-toast';

export default function QRCodeGenerateModal({ isOpen, onClose, address, caip_address, network}) {
  const { t } = useTranslation();
  const secretKeyRef = useRef(null);
  let uri = detectChainType(caip_address)+`${address}`;

  function detectChainType(address) {
    if (typeof address !== 'string') return "";
    const [namespace] = address.split(':');
    if (!namespace) return "";

    switch (namespace) {
      case 'eip155':
        return 'ethereum:';
      case 'solana':
        return 'solana:';
      case 'bip122':
        return 'bitcoin:';
      default:
        return '';
    }
  }

  const copyToClipboard = () => {
    if (secretKeyRef.current) {
      const text = secretKeyRef.current.innerText.trim();
      navigator.clipboard.writeText(text)
        .then(() => toast.success("Copied to clipboard"))
        .catch((err) => toast.error("Failed to copy"),
        console.error("Failed to copy: ", err));
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
                        <h3>{t("modals.codeGenerate.title")}</h3>
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
