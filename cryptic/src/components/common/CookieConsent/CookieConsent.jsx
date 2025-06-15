// src/components/common/CookieConsent/CookieConsent.jsx
import { useEffect, useState } from "react";
import styles from "./CookieConsent.module.css";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookie_consent");
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie_consent", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={styles.cookieBanner}>
  <p>
    We use cookies to improve your experience on our site. By continuing to browse, you agree to our{" "}
    <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
  </p>
  <button onClick={acceptCookies}>Accept</button>
    </div>
  );
}
