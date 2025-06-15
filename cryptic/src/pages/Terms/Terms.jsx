import { useEffect, useState } from "react";
import styles from "./Terms.module.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import MainNavbar from "../../components/navigation/Navbar/Main/Main";
import Footer from "../../components/navigation/Footer/Footer";
import { useTranslation } from "react-i18next";

export default function Terms() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className={styles.transferContent}>
      <MainNavbar />
        <main className={styles.termsContainer}>
          <h1>Terms of Use</h1>

          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using our service, you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree, please do not use the platform.
            </p>
          </section>

          <section>
            <h2>2. Services Provided</h2>
            <p>
              We provide tools for analyzing, managing, and visualizing cryptocurrency wallet data. All data displayed is for informational purposes only and does not constitute financial advice.
            </p>
          </section>

          <section>
            <h2>3. Wallet Connection</h2>
            <p>
              When connecting your wallet via third-party providers (e.g., MetaMask, Phantom), you agree that we may access your public wallet address and associated on-chain data to provide analytics.
            </p>
          </section>

          <section>
            <h2>4. User Responsibility</h2>
            <p>
              You are responsible for the security of your wallet and private keys. We do not store your private keys and cannot recover lost access.
            </p>
          </section>

          <section>
            <h2>5. No Financial Advice</h2>
            <p>
              All analytics and insights are provided for informational purposes only. We do not offer investment advice, and past performance does not guarantee future results.
            </p>
          </section>

          <section>
            <h2>6. Changes to Terms</h2>
            <p>
              We reserve the right to update these terms at any time. Continued use of the platform constitutes your acceptance of any changes.
            </p>
          </section>

          <section>
            <h2>7. Contact</h2>
            <p>
              For any questions regarding these Terms, please contact our support team at <a href="mailto:support@cryptoanalytics.app">support@cryptoanalytics.app</a>.
            </p>
          </section>
        </main>
      <Footer />
    </div>
  );
}