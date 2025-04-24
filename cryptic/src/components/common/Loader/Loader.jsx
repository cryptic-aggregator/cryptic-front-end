import React from 'react';
import styles from './Loader.module.css';         
import zeroCircleAnim from "../../../assets/images/HomePage/zeroCircleAnim.svg";
import firstCircleAnim from "../../../assets/images/HomePage/firstCircleAnim.svg";
import secondCircleAnim from "../../../assets/images/HomePage/secondCircleAnim.svg";
import thirdCircleAnim from "../../../assets/images/HomePage/thirdCircleAnim.svg";
          
const Loader = () => {
    return (
        <div className={styles.loader}>
            <div className={styles.animationBrand}>
                <img className={styles.animationBrandZeroCircle} src={zeroCircleAnim} alt="Logo" />
                <img className={styles.animationBrandFirstCircle} src={firstCircleAnim} alt="Logo" />
                <img className={styles.animationBrandSecondCircle} src={secondCircleAnim} alt="Logo" />
                <img className={styles.animationBrandThirdCircle} src={thirdCircleAnim} alt="Logo" />
            </div>
            <span className={styles.animationBrandText}>Loading</span>
        </div>

    );
  };
  
  export default Loader;         
