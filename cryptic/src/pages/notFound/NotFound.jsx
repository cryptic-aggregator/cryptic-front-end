
import React from "react";
import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.message}>{t("notFound.text")}</p>
      <Link to="/" className={styles.link}>{t("notFound.link")}</Link>
    </div>
  );
};

export default NotFound;
