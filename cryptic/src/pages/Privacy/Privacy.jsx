import { useEffect, useState } from "react";
import styles from "./Privacy.module.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import MainNavbar from "../../components/navigation/Navbar/Main/Main";
import Footer from "../../components/navigation/Footer/Footer";
import { useTranslation } from "react-i18next";

export default function Privacy() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className={styles.transferContent}>
      <MainNavbar />
        <main className={styles.privacyContainer}>
        <h1>Privacy Policy</h1>

        <section>
          <h2>1. Introduction</h2>
          <p>
            This Privacy Policy explains how we collect, use, and protect your data when you use our platform. By using the service, you agree to the practices outlined below.
          </p>
        </section>

        <section>
          <h2>2. Data We Collect</h2>
          <p>
            We do not collect any personally identifiable information unless you explicitly provide it (e.g., via contact forms).
            When connecting a wallet, we only access:
          </p>
          <ul>
            <li>Your public wallet address</li>
            <li>Blockchain transaction history</li>
            <li>Token balances</li>
          </ul>
          <p>
            We do not store private keys or sign any transactions on your behalf.
          </p>
        </section>

        <section>
          <h2>3. How We Use Your Data</h2>
          <p>Your on-chain data is used exclusively to:</p>
          <ul>
            <li>Provide personalized portfolio analytics</li>
            <li>Visualize wallet activity and token distribution</li>
            <li>Improve user experience and service performance</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Sharing</h2>
          <p>
            We do not sell, trade, or share your data with third parties, except as required by law or when using trusted third-party tools for analytics (e.g., anonymized usage statistics).
          </p>
        </section>

        <section>
          <h2>5. Security</h2>
          <p>
            We take reasonable precautions to protect your data. However, as we rely on decentralized wallets, we cannot guarantee full security of your connected wallet or blockchain activity.
          </p>
        </section>

        <section>
          <h2>6. Your Rights</h2>
          <p>
            You can disconnect your wallet at any time. No personal data is stored on our servers, so once disconnected, we retain no link to your activity.
          </p>
        </section>

        <section>
          <h2>7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Continued use of the service after updates means you accept the revised policy.
          </p>
        </section>

        <section>
          <h2>8. Contact</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@cryptoanalytics.app">support@cryptoanalytics.app</a>.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}