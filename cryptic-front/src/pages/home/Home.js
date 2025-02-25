import styles from "./Home.module.css";
import Navbar from "../../components/Navbar.js";
import Footer from "../../components/Footer.js";
import settings from "../../assets/images/HomePage/settings.svg";
import calendar from "../../assets/images/HomePage/calendar.svg";
import checkMark from "../../assets/images/HomePage/checkMark.svg";
import diagram from "../../assets/images/HomePage/diagram.svg";
import rightArrowAngle from "../../assets/images/HomePage/rightArrowAngle.svg";
import chartDynamic from "../../assets/images/HomePage/chartDynamic.svg";
import otherLogo from "../../assets/images/HomePage/otherLogo.svg";
import metamaskLogo from "../../assets/images/HomePage/metamaskLogo.svg";
import phantomLogo from "../../assets/images/HomePage/phantomLogo.svg";
import mobileApp from "../../assets/images/HomePage/mobileApp.svg";
import portfolioGoals from "../../assets/images/HomePage/PortfolioGoals.svg";
import logo from "../../assets/images/HomePage/Logo.svg";
import otherLogoEllipse from "../../assets/images/HomePage/otherLogoEllipse.svg";
import phantomLogoEllipse from "../../assets/images/HomePage/phantomLogoEllipse.svg";
import metamaskLogoEllipse from "../../assets/images/HomePage/metamaskLogoEllipse.svg";

import zeroCircleAnim from "../../assets/images/HomePage/zeroCircleAnim.svg";
import firstCircleAnim from "../../assets/images/HomePage/firstCircleAnim.svg";
import secondCircleAnim from "../../assets/images/HomePage/secondCircleAnim.svg";
import thirdCircleAnim from "../../assets/images/HomePage/thirdCircleAnim.svg";

import balanceAnalyticsGoals from "../../assets/images/HomePage/BalanceAnalyticsGoals.svg";
import transactionDataGoals from "../../assets/images/HomePage/TransactionDataGoals.svg";
import transactionCostGoals from "../../assets/images/HomePage/TransactionCostGoals.svg";
import transferGoals from "../../assets/images/HomePage/TransferGoals.svg";
import graph from "../../assets/images/HomePage/Graph.svg";
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const {t} = useTranslation();
  useEffect(() => {
    const animItems = document.querySelectorAll(".animItems");

    if (animItems.length > 0) {
      const animOnScroll = () => {
        animItems.forEach((animItem) => {
          if (!animItem) return;
  
          const animItemHeight = animItem.offsetHeight;
          const animItemOffset = offset(animItem).top;
          const animStart = 1; // Adjusted this value to trigger animation earlier
  
          let animItemPoint = window.innerHeight - animItemHeight / animStart;
          if (animItemHeight > window.innerHeight) {
            animItemPoint = window.innerHeight - window.innerHeight / animStart;
          }
  
          if (
            window.scrollY  > animItemOffset - animItemPoint &&
            window.scrollY  < animItemOffset + animItemHeight
          ) {
            console.log(animItems)
            animItem.classList.add(`${styles.active}`);
          }else{
            animItem.classList.remove(`${styles.active}`);
          }
        });
      };
  
      // Helper function to get element's offset
      function offset(el) {
        const rect = el.getBoundingClientRect();
        const scrollLeft = window.scrollY  || document.documentElement.scrollLeft;
        const scrollTop = window.scrollY  || document.documentElement.scrollTop;
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
      }
  
      // Initial check
      setTimeout(animOnScroll, 300); // Add slight delay for initial load
  
      window.addEventListener("scroll", animOnScroll);
      return () => window.removeEventListener("scroll", animOnScroll);
    }
  }, []);

  return (
    <>
    <Navbar/>
    <main className={styles.home}> 
      <section className={styles.sectionFirst}>
        <div className={styles.contentSectionFirst}>
          <div className={styles.infoSectionFirst}>
            <div className={styles.slogan}>{t('home.slogan')}</div>
            <div className={styles.title2}>{t('home.trackBalances')}</div>
            <Link to="/signUp" className={styles.startNowButton}>
              <label>{t('home.startNow')}</label>
              <span class={styles.imgWrapper}>
                <img src={rightArrowAngle}  alt="icon"/>
              </span>
            </Link>
          </div>
          <div className={styles.wallet}>
            <Link to="/connectWallet"className={styles.otherLogo} >
                <img className={styles.logoEllipse} src={otherLogoEllipse} alt="Other logo" />
                <img className={styles.logoWallet} src={otherLogo} alt="Other logo" />
                <span data-tooltip={t('home.connectWallet')}>{t('home.other')}</span>
            </Link>

            <Link to="/connectWallet" className={styles.metamaskLogo} >
                <img className={styles.logoEllipse} src={metamaskLogoEllipse} alt="Other logo" />
                <img className={styles.logoWallet} src={metamaskLogo} alt="Metamask logo" />
                <span data-tooltip={t('home.connectWallet')}>{t('home.metamask')}</span>
            </Link>

            <Link to="/connectWallet" className={styles.phantomLogo} >
                <img className={styles.logoEllipse} src={phantomLogoEllipse} alt="Other logo" />
                <img className={styles.logoWallet} src={phantomLogo} alt="Phantom logo" />
                <span data-tooltip={t('home.connectWallet')}>{t('home.phantom')}</span>
            </Link>
          </div>
        </div>

      </section>

      <section className={styles.sectionSecond}>
        <div className={styles.contentSectionSecond}>
          <div className={styles.goalsInfo}>
            <div className={styles.goalsText}>
              <div className={styles.title1}>{t('home.goalsTitle')}</div>
              <div className={styles.title2}>{t('home.goalsSubtitle')}</div>
            </div>
            <div className={styles.goalsList}>
              <ul className={styles.goalsListUl}>
                <li className={`animItems ${styles.goalsListUlElements}`}>
                  <div className={styles.goalsListText}>
                    <img src={transferGoals} alt="Transfer" />
                    <p>{t('home.transferAssets')}</p>
                  </div>
                </li>
                <li className={`animItems ${styles.goalsListUlElements}`}>
                  <div className={styles.goalsListText}>
                    <img src={portfolioGoals} alt="Manage" />
                    <p>{t('home.managePortfolios')}</p>
                  </div>
                </li>
                <li className={`animItems ${styles.goalsListUlElements}`}>
                  <div className={styles.goalsListText}>
                    <img src={transactionDataGoals} alt="View" />
                    <p>{t('home.viewTransactions')}</p>
                  </div>
                </li>
                <li className={`animItems ${styles.goalsListUlElements}`}>
                  <div className={styles.goalsListText}>
                    <img src={transactionCostGoals} alt="Track" />
                    <p>{t('home.trackCosts')}</p>
                  </div>
                </li>
                <li className={`animItems ${styles.goalsListUlElements}`}>
                  <div className={styles.goalsListText}>
                    <img src={balanceAnalyticsGoals} alt="Analyze" />
                    <p>{t('home.analyzeBalances')}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>    
      </section>
      <section className={styles.sectionThird}>
        <div className={styles.contentSectionThird}>
          <div className={styles.analiiticsInfo}>
            <div className={styles.analiiticsInfoImg}>
              <img src={graph} alt="Analytics" />
            </div>
            <div className={styles.analiiticsInfoText}>
              <div className={styles.title1}>{t('home.analyticsTitle')}</div>
              <div className={styles.title2}>{t('home.analyticsDescription1')}</div>
              <div className={styles.title2}>{t('home.analyticsDescription2')}</div>
            </div>
          </div>

          <div className={styles.analyticsList}>
          <ul className={styles.analyticsListUl}>
              <li className={styles.analyticsListUlElements}>
                <img src={settings} alt="Customize" />
                <span>{t('home.customizeData')}</span>
              </li> 
              <li className={styles.analyticsListUlElements}>
                <img src={calendar} alt="Select" />
                <span>{t('home.selectTime')}</span>
              </li>
              <li className={styles.analyticsListUlElements}>
                <img src={diagram} alt="Get Info" />
                <span>{t('home.getInfo')}</span>
              </li>
              <li className={styles.analyticsListUlElements}>
                <img src={checkMark} alt="Choose" />
                <span>{t('home.chooseWallet')}</span>
              </li>
            </ul>
          </div>
        </div>
       
      </section>

      <section className={styles.sectionFourth}>
        <div className={styles.contentSectionFourth}>
          <div className={styles.transferInfoText}>
            <div className={styles.title1}>{t('home.transferTitle')}</div>
            <div className={styles.title2}>{t('home.transferSubtitle')}</div>
            <Link to="/signUp" className={styles.tryNowButton}>{t('home.tryNow')}</Link>
          </div>
          <div className={styles.transferInfoImg}>
            <img src={chartDynamic} alt="Transfer" />
          </div>
        </div>

      </section>
   
      <section className={styles.sectionFifth}>
        <div className={styles.contentSectionFifth}>
          <div className={styles.title0}>{t('home.mobileAppTitle')}</div>
            <div className={styles.mobileAppInfo}>
                <div className={styles.leftInfo}>
                  <li className={styles.security}>
                      <div className={styles.infoText}>
                        <div className={styles.InfoTopic}>{t('home.securityTitle')}</div>
                        <div className={styles.title2}>{t('home.securityText')}</div>
                      </div>
                    </li>
                    
                    <li className={styles.notifications}>
                      <div className={styles.infoText}>
                        <div className={styles.InfoTopic}>{t('home.notificationsTitle')}</div>
                        <div className={styles.title2}>{t('home.notificationsText')}</div>
                      </div>
                    </li>
                </div>
                <div className={styles.centralInfo}>
                    <div className={styles.downloadMobileApp}>
                      <Link to="/downloadApp" className={styles.downloadMobileAppButton}>{t('home.download')}</Link>
                    </div>
                    <div className={styles.downloadMobileAppImg}>
                      <img className={styles.mobileAppImg} src={mobileApp} alt="Mobile App" />
                    </div>
                </div>
                <div className={styles.rightInfo}>
                    <li className={styles.lightness}>
                      <div className={styles.infoText}>
                        <div className={styles.InfoTopic}>{t('home.lightnessTitle')}</div>
                        <div className={styles.title2}>{t('home.lightnessText')}</div>
                      </div>
                    </li>
                    <li className={styles.access}>
                      <div className={styles.infoText}>
                        <div className={styles.InfoTopic}>{t('home.accessTitle')}</div>
                        <div className={styles.title2}>{t('home.accessText')} </div>
                      </div>
                    </li>
                </div>
            </div> 
          </div>
      </section>

      <section className={styles.sectionSixth}>
        <div className={styles.backgroundSection}></div>
        <div className={styles.contentSectionSixth}>
          <div className={styles.title0} >{t('home.cryptoJourney')}</div>
          <div className={styles.animation}>
            <div className={styles.animationBrand}>
                <img className={styles.animationBrandZeroCircle} src={zeroCircleAnim} alt="Logo" />
                <img className={styles.animationBrandFirstCircle} src={firstCircleAnim} alt="Logo" />
                <img className={styles.animationBrandSecondCircle} src={secondCircleAnim} alt="Logo" />
                <img className={styles.animationBrandThirdCircle} src={thirdCircleAnim} alt="Logo" />
            </div>
            <div className={styles.textLogo}>RYPTIC</div>
          </div>
          <Link to="/signUp" className={styles.startNowButtonEnd}>{t('home.startNow')}</Link>
        </div>
      </section>

    </main>

    <Footer/>

    </>
  );
}
