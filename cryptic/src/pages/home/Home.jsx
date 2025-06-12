import styles from "./Home.module.css";

import Navbar from "../../components/navigation/Navbar/Main/Main";
import Footer from "../../components/navigation/Footer/Footer";
import settings from "../../assets/images/Home/settings.svg";
import calendar from "../../assets/images/Home/calendar.svg";
import checkMark from "../../assets/images/Home/checkMark.svg";
import diagram from "../../assets/images/Home/diagram.svg";
import rightArrowAngle from "../../assets/images/Home/rightArrowAngle.svg";
import chartDynamic from "../../assets/images/Home/chartDynamic.svg";
import otherLogo from "../../assets/images/Home/otherLogo.svg";
import metamaskLogo from "../../assets/images/Home/metamaskLogo.svg";
import phantomLogo from "../../assets/images/Home/phantomLogo.svg";
import mobileApp from "../../assets/images/Home/mobileApp.svg";
import portfolioGoals from "../../assets/images/Home/PortfolioGoals.svg";
import otherLogoEllipse from "../../assets/images/Home/otherLogoEllipse.svg";
import phantomLogoEllipse from "../../assets/images/Home/phantomLogoEllipse.svg";
import metamaskLogoEllipse from "../../assets/images/Home/metamaskLogoEllipse.svg";
import zeroCircleAnim from "../../assets/images/Home/zeroCircleAnim.svg";
import firstCircleAnim from "../../assets/images/Home/firstCircleAnim.svg";
import secondCircleAnim from "../../assets/images/Home/secondCircleAnim.svg";
import thirdCircleAnim from "../../assets/images/Home/thirdCircleAnim.svg";

import balanceAnalyticsGoals from "../../assets/images/Home/BalanceAnalyticsGoals.svg";
import transactionDataGoals from "../../assets/images/Home/TransactionDataGoals.svg";
import transactionCostGoals from "../../assets/images/Home/TransactionCostGoals.svg";
import transferGoals from "../../assets/images/Home/TransferGoals.svg";
import graph from "../../assets/images/Home/Graph.svg";
import { useTranslation } from 'react-i18next';
import { useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
import { walletApi } from "../../api/endpoints/walletApi";
import { setSelectedWallet } from "../../store/slices/walletSlice";
import { useDispatch } from "react-redux";



export default function Home() {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
            <div className={styles.slogan}>{t('home.hero.slogan')}</div>
            <div className={styles.title2}>{t('home.hero.trackBalances')}</div>
            <Link to="/signUp" className={styles.startNowButton}>
              <label>{t('home.hero.startNow')}</label>
              <span className={styles.imgWrapper}>
                <img src={rightArrowAngle}  alt="icon"/>
              </span>
            </Link>
          </div>
          <div className={styles.wallet}>
          <Link 
            to="/connectWallet" 
            className={styles.otherLogo}
            onClick={(e) => {
              e.preventDefault();
              dispatch(setSelectedWallet("other"));
              navigate('/connectWallet');
            }}
          >
            <img className={styles.logoEllipse} src={otherLogoEllipse} alt="Other logo" />
            <img className={styles.logoWallet} src={otherLogo} alt="Other logo" />
            <span data-tooltip={t('home.wallets.connectWallet')}>{t('home.wallets.other')}</span>
          </Link>

          <Link 
            to="/connectWallet" 
            className={styles.metamaskLogo}
            onClick={(e) => {
              e.preventDefault();
              dispatch(setSelectedWallet("metamask"));
              navigate('/connectWallet');
            }}
          >
            <img className={styles.logoEllipse} src={metamaskLogoEllipse} alt="Other logo" />
            <img className={styles.logoWallet} src={metamaskLogo} alt="Metamask logo" />
            <span data-tooltip={t('home.wallets.connectWallet')}>{t('home.wallets.metamask')}</span>
          </Link>

          <Link 
            to="/connectWallet" 
            className={styles.phantomLogo}
            onClick={(e) => {
              e.preventDefault();
              dispatch(setSelectedWallet("phantom"));
              navigate('/connectWallet');
            }}
          >
            <img className={styles.logoEllipse} src={phantomLogoEllipse} alt="Other logo" />
            <img className={styles.logoWallet} src={phantomLogo} alt="Phantom logo" />
            <span data-tooltip={t('home.wallets.connectWallet')}>{t('home.wallets.phantom')}</span>
          </Link>
            
          </div>
        </div>

      </section>

      <section className={styles.sectionSecond}>
        <div className={styles.contentSectionSecond}>
          <div className={styles.goalsInfo}>
            <div className={styles.goalsText}>
              <div className={styles.title1}>{t('home.goals.title')}</div>
              <div className={styles.title2}>{t('home.goals.subtitle')}</div>
            </div>
            <div className={styles.goalsList}>
              <ul className={styles.goalsListUl}>
                <li className={`animItems ${styles.goalsListUlElements}`}>
                  <div className={styles.goalsListText}>
                    <img src={transferGoals} alt="Transfer" />
                    <p>{t('home.goals.features.transferAssets')}</p>
                  </div>
                </li>
                <li className={`animItems ${styles.goalsListUlElements}`}>
                  <div className={styles.goalsListText}>
                    <img src={portfolioGoals} alt="Manage" />
                    <p>{t('home.goals.features.managePortfolios')}</p>
                  </div>
                </li>
                <li className={`animItems ${styles.goalsListUlElements}`}>
                  <div className={styles.goalsListText}>
                    <img src={transactionDataGoals} alt="View" />
                    <p>{t('home.goals.features.viewTransactions')}</p>
                  </div>
                </li>
                <li className={`animItems ${styles.goalsListUlElements}`}>
                  <div className={styles.goalsListText}>
                    <img src={transactionCostGoals} alt="Track" />
                    <p>{t('home.goals.features.trackCosts')}</p>
                  </div>
                </li>
                <li className={`animItems ${styles.goalsListUlElements}`}>
                  <div className={styles.goalsListText}>
                    <img src={balanceAnalyticsGoals} alt="Analyze" />
                    <p>{t('home.goals.features.analyzeBalances')}</p>
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
              <div className={styles.title1}>{t('home.analytics.title')}</div>
              <div className={styles.title2}>{t('home.analytics.descriptions.tools')}</div>
              <div className={styles.title2}>{t('home.analytics.descriptions.portfolio')}</div>
            </div>
          </div>

          <div className={styles.analyticsList}>
          <ul className={styles.analyticsListUl}>
              <li className={styles.analyticsListUlElements}>
                <img src={settings} alt="Customize" />
                <span>{t('home.analytics.actions.customizeData')}</span>
              </li> 
              <li className={styles.analyticsListUlElements}>
                <img src={calendar} alt="Select" />
                <span>{t('home.analytics.actions.selectTime')}</span>
              </li>
              <li className={styles.analyticsListUlElements}>
                <img src={diagram} alt="Get Info" />
                <span>{t('home.analytics.actions.getInfo')}</span>
              </li>
              <li className={styles.analyticsListUlElements}>
                <img src={checkMark} alt="Choose" />
                <span>{t('home.analytics.actions.chooseWallet')}</span>
              </li>
            </ul>
          </div>
        </div>
       
      </section>

      <section className={styles.sectionFourth}>
        <div className={styles.contentSectionFourth}>
          <div className={styles.transferInfoText}>
            <div className={styles.title1}>{t('home.transfer.title')}</div>
            <div className={styles.title2}>{t('home.transfer.subtitle')}</div>
            <Link to="/signUp" className={styles.tryNowButton}>{t('home.transfer.tryNow')}</Link>
          </div>
          <div className={styles.transferInfoImg}>
            <img src={chartDynamic} alt="Transfer" />
          </div>
        </div>

      </section>
   
      <section className={styles.sectionFifth}>
        <div className={styles.contentSectionFifth}>
          <div className={styles.title0}>{t('home.mobileApp.title')}</div>
            <div className={styles.mobileAppInfo}>
                <div className={styles.leftInfo}>
                  <li className={styles.security}>
                      <div className={styles.infoText}>
                        <div className={styles.InfoTopic}>{t('home.mobileApp.security.title')}</div>
                        <div className={styles.title2}>{t('home.mobileApp.security.description')}</div>
                      </div>
                    </li>
                    
                    <li className={styles.notifications}>
                      <div className={styles.infoText}>
                        <div className={styles.InfoTopic}>{t('home.mobileApp.notifications.title')}</div>
                        <div className={styles.title2}>{t('home.mobileApp.notifications.description')}</div>
                      </div>
                    </li>
                </div>
                <div className={styles.centralInfo}>
                    <div className={styles.downloadMobileApp}>
                      <Link to="/downloadApp" className={styles.downloadMobileAppButton}>{t('home.mobileApp.download')}</Link>
                    </div>
                    <div className={styles.downloadMobileAppImg}>
                      <img className={styles.mobileAppImg} src={mobileApp} alt="Mobile App" />
                    </div>
                </div>
                <div className={styles.rightInfo}>
                    <li className={styles.lightness}>
                      <div className={styles.infoText}>
                        <div className={styles.InfoTopic}>{t('home.mobileApp.lightness.title')}</div>
                        <div className={styles.title2}>{t('home.mobileApp.lightness.description')}</div>
                      </div>
                    </li>
                    <li className={styles.access}>
                      <div className={styles.infoText}>
                        <div className={styles.InfoTopic}>{t('home.mobileApp.access.title')}</div>
                        <div className={styles.title2}>{t('home.mobileApp.access.description')} </div>
                      </div>
                    </li>
                </div>
            </div> 
          </div>
      </section>

      <section className={styles.sectionSixth}>
        <div className={styles.backgroundSection}></div>
        <div className={styles.contentSectionSixth}>
          <div className={styles.title0} >{t('home.hero.cryptoJourney')}</div>
          <div className={styles.animation}>
            <div className={styles.animationBrand}>
                <img className={styles.animationBrandZeroCircle} src={zeroCircleAnim} alt="Logo" />
                <img className={styles.animationBrandFirstCircle} src={firstCircleAnim} alt="Logo" />
                <img className={styles.animationBrandSecondCircle} src={secondCircleAnim} alt="Logo" />
                <img className={styles.animationBrandThirdCircle} src={thirdCircleAnim} alt="Logo" />
            </div>
            <div className={styles.textLogo}>RYPTIC</div>
          </div>
          <Link to="/signUp" className={styles.startNowButtonEnd}>{t('home.hero.startNow')}</Link>
        </div>
      </section>

    </main>

    <Footer/>

    </>
  );
}
