import React from 'react';
import styles from './Loader.module.css';         
import zeroCircleAnim from "../../../assets/images/Home/zeroCircleAnim.svg";
import firstCircleAnim from "../../../assets/images/Home/firstCircleAnim.svg";
import secondCircleAnim from "../../../assets/images/Home/secondCircleAnim.svg";
import thirdCircleAnim from "../../../assets/images/Home/thirdCircleAnim.svg";
import { useTranslation } from 'react-i18next';
          
const Loader = ({ text }) => {
    const {t} = useTranslation();
    const titel = text || `${t("common.loading")}`
    return (
        <div className={styles.loader}>
            <div className={styles.animationBrand}>
                <img className={styles.animationBrandZeroCircle} src={zeroCircleAnim} alt="Logo" />
                <img className={styles.animationBrandFirstCircle} src={firstCircleAnim} alt="Logo" />
                <img className={styles.animationBrandSecondCircle} src={secondCircleAnim} alt="Logo" />
                <img className={styles.animationBrandThirdCircle} src={thirdCircleAnim} alt="Logo" />
            </div>
            <span className={styles.animationBrandText}>{titel}</span>
        </div>

    );
  };
  
  export default Loader;         
