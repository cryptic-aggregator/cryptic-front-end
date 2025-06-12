import { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Premium.module.css";
import toast from 'react-hot-toast';
import unlimited from "../../../assets/images/UserProfile/unlimited.svg";
import analytics from "../../../assets/images/UserProfile/analytics.svg";
import notifications from "../../../assets/images/UserProfile/notifications.svg";
export default function Premium() {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setShowToast({ show: true, message, type });
    setTimeout(() => setShowToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleActivate = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(t('profile.premium.activating'));
    } catch (error) {
      toast.error(t('profile.premium.errorActivating'), 'error');
      console.error("Activation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon:  <img src={analytics} alt="Search" className={styles.featureIcon} />,
      title: t("profile.premium.features.analyticsTitle"),
      description: t("profile.premium.features.analyticsDescription")
    },
    {
      icon:  <img src={notifications} alt="Search" className={styles.featureIcon} />,
      title: t("profile.premium.features.notificationsTitle"),
      description: t("profile.premium.features.notificationsDescription")
    },
    {
      icon:  <img src={unlimited} alt="Search" className={styles.featureIcon} />,
      title: t("profile.premium.features.walletsTitle"),
      description: t("profile.premium.features.walletsDescription")
    }
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t("profile.premium.title")}</h1>
        <p className={styles.subtitle}>{t("profile.premium.subtitle")}</p>
      </div>

      <div className={styles.featuresContainer}>
        {features.map((feature, index) => (
          <div key={index} className={styles.featureCard}>
            <div className={styles.featureContent}>
              <div className={styles.featureIcon}>
                <span>{feature.icon}</span>
              </div>
              <div className={styles.featureText}>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <div className={styles.featureDescription}>{feature.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.pricingCard}>
        <div className={styles.pricingContent}>
          <div className={styles.priceWrapper}>
            <span className={styles.price}>$4.99</span>
            <span className={styles.period}>/month</span>
          </div>
          <div className={styles.guarantee}>
            {t("profile.premium.guarantee")}
          </div>

          <button
            onClick={handleActivate}
            disabled={isLoading}
            className={`${styles.activateButton} ${isLoading ? styles.buttonLoading : ''}`}
          >
            {isLoading ? (
              <div className={styles.loadingContent}>
                <div className={styles.spinner}></div>
                {t("profile.premium.activating")}
              </div>
            ) : (
              <div className={styles.buttonContent}>
                {t("profile.premium.activateButton")}
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
