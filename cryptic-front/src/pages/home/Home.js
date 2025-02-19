import styles from "./Home.module.css";
import Navbar from "../../components/Navbar.js";
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
import { useState, useEffect } from "react";

export default function Home() {
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
        <div className={styles.infoSectionFirst}>
          <div className={styles.slogan}>Simple and Secure <br />Management of Your <br />Crypto Wallets</div>
          <div className={styles.title2}>Track balances, analyze portfolios,<br /> and receive notifications with one click.</div>
          <button className={styles.startNowButton}>
            <label>Start Now</label>
            <span class={styles.imgWrapper}>
               <img src={rightArrowAngle}  alt="icon"/>
            </span>
          </button>
        </div>
        <div className={styles.wallet}>
          <button className={styles.otherLogo}>
              <img className={styles.logoEllipse} src={otherLogoEllipse} alt="Other logo" />
              <img className={styles.logoWallet} src={otherLogo} alt="Other logo" />
              <span>Other</span>
          </button>

          <button className={styles.metamaskLogo}>
              <img className={styles.logoEllipse} src={metamaskLogoEllipse} alt="Other logo" />
              <img className={styles.logoWallet} src={metamaskLogo} alt="Metamask logo" />
              <span>Metamask</span>
          </button>

          <button className={styles.phantomLogo}>
              <img className={styles.logoEllipse} src={phantomLogoEllipse} alt="Other logo" />
              <img className={styles.logoWallet} src={phantomLogo} alt="Phantom logo" />
              <span>Phantom</span>
          </button>
        </div>
      </section>

      <section className={styles.sectionSecond}>
        <div className={styles.goalsInfo}>
          <div className={styles.goalsText}>
            <div className={styles.title1}>Maximize the potential of the platform to achieve your goals</div>
            <div className={styles.title2}>Create portfolio, connect your wallets, use analytical tools, send transactions</div>
          </div>
          <div className={styles.goalsList}>
            <ul className={styles.goalsListUl}>
              <li className={`animItems ${styles.goalsListUlElements}`}>
                <div className={styles.goalsListText}>
                  <img src={transferGoals} alt="Transfer" />
                  <p>Transfer your assets</p>
                </div>
              </li>
              <li className={`animItems ${styles.goalsListUlElements}`}>
                <div className={styles.goalsListText}>
                  <img src={portfolioGoals} alt="Manage" />
                  <p>Manage different portfolios</p>
                </div>
              </li>
              <li className={`animItems ${styles.goalsListUlElements}`}>
                <div className={styles.goalsListText}>
                  <img src={transactionDataGoals} alt="View" />
                  <p>View historical transaction data</p>
                </div>
              </li>
              <li className={`animItems ${styles.goalsListUlElements}`}>
                <div className={styles.goalsListText}>
                  <img src={transactionCostGoals} alt="Track" />
                  <p>Track transaction costs</p>
                </div>
              </li>
              <li className={`animItems ${styles.goalsListUlElements}`}>
                <div className={styles.goalsListText}>
                  <img src={balanceAnalyticsGoals} alt="Analyze" />
                  <p>Analyze wallet balance changes</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className={styles.sectionThird}>
        <div className={styles.analiiticsInfo}>
          <div className={styles.analiiticsInfoImg}>
            <img src={graph} alt="Analytics" />
          </div>
          <div className={styles.analiiticsInfoText}>
            <div className={styles.title1}>Access comprehensive asset analytics for your portfolios</div>
            <div className={styles.title2}>
              Discover our platform's powerful analytical tools, featuring interactive charts for tracking balance changes.
            </div>
            <div className={styles.title2}>
              Gain insights into asset allocation with  portfolio structure analysis and monitor your profitability with detailed performance metrics for each coin.
            </div>
          </div>
        </div>

        <div className={styles.analyticsList}>
         <ul className={styles.analyticsListUl}>
            <li className={styles.analyticsListUlElements}>
              <img src={settings} alt="Customize" />
              <span>Customize the data <br/> displayed</span>
            </li> 
            <li className={styles.analyticsListUlElements}>
              <img src={calendar} alt="Select" />
              <span>Select a time <br/> period</span>
            </li>
            <li className={styles.analyticsListUlElements}>
              <img src={diagram} alt="Get Info" />
              <span>Get all you need <br/> to know</span>
            </li>
            <li className={styles.analyticsListUlElements}>
              <img src={checkMark} alt="Choose" />
              <span>Choose your <br/> wallet</span>
            </li>
          </ul>
        </div>
      </section>

      <section className={styles.sectionFourth}>
        <div className={styles.transferInfo}>
          <div className={styles.transferInfoText}>
            <div className={styles.title1}>Easily transfer your assets to other addresses</div>
            <div className={styles.title2}>Store recipient addresses to make transfer faster and easier</div>
            <button className={styles.tryNowButton}>Try Now</button>
          </div>
          <div className={styles.transferInfoImg}>
            <img src={chartDynamic} alt="Transfer" />
          </div>
        </div>

      </section>
   
      <section className={styles.sectionFifth}>
          <div className={styles.title0}>Get our free mobile app</div>
          <div className={styles.mobileAppInfo}>
              <div className={styles.leftInfo}>
                 <li className={styles.security}>
                    <div className={styles.infoText}>
                      <div className={styles.InfoTopic}>Security</div>
                      <div className={styles.title2}>Protect your crypto assets with robust encryption and two-factor authentication. 
                        Enjoy peace of mind in every transaction, knowing all your data is securely safeguarded.
                      </div>
                    </div>
                  </li>
                  
                  <li className={styles.notifications}>
                    <div className={styles.infoText}>
                      <div className={styles.InfoTopic}>Notifications</div>
                      <div className={styles.title2}>Receive and manage push notifications for every operation and balance change. 
                        Stay on top of every update and respond promptly to important events.
                      </div>
                    </div>
                  </li>
              </div>
              <div className={styles.centralInfo}>
                  <div className={styles.downloadMobileApp}>
                    <button className={styles.downloadMobileAppButton}>Download</button>
                  </div>
                  <div className={styles.downloadMobileAppImg}>
                    <img className={styles.mobileAppImg} src={mobileApp} alt="Mobile App" />
                  </div>
              </div>
              <div className={styles.rightInfo}>
                  <li className={styles.lightness}>
                    <div className={styles.infoText}>
                      <div className={styles.InfoTopic}>Lightness</div>
                      <div className={styles.title2}>Use QR codes for quick and convenient transfers. 
                        Simply scan the code with one tap—no more errors or lengthy procedures.
                      </div>
                    </div>
                  </li>
                  <li className={styles.access}>
                    <div className={styles.infoText}>
                      <div className={styles.InfoTopic}>Access</div>
                      <div className={styles.title2}>Keep all the most important information at your fingertips. 
                        From transaction history to analytics—everything is available in one click, wherever you are.
                      </div>
                    </div>
                  </li>
              </div>
          </div> 
      </section>

      <section className={styles.sectionSixth}>
        <div className={styles.backgroundSection}></div>
        <div className={styles.title0} >Feel free on your crypto journey with</div>
        <div className={styles.animation}>
          <div className={styles.animationBrand}>
              <img className={styles.animationBrandZeroCircle} src={zeroCircleAnim} alt="Logo" />
              <img className={styles.animationBrandFirstCircle} src={firstCircleAnim} alt="Logo" />
              <img className={styles.animationBrandSecondCircle} src={secondCircleAnim} alt="Logo" />
              <img className={styles.animationBrandThirdCircle} src={thirdCircleAnim} alt="Logo" />
          </div>
          <div className={styles.textLogo}>RYPTIC</div>
        </div>
        <button className={styles.startNowButtonEnd}>Start Now</button>
      </section>

    </main>

    <footer>
        <div className={styles.footerContent}>
          <li className={styles.brand}>
              ©2024 Cryptic
          </li>
          <ul className={styles.footerUl}>
            <li>
              <button>Terms  of Service</button>
            </li>
            <li>
              <button>Privacy Policy</button>
            </li>
          </ul>  
        </div> 
    </footer>

     
    </>
  );
}
