import Loader from '../../../components/common/Loader/Loader';
import Error from '../../../components/common/Error/Error';
import styles from "./AnalyticsSection.module.css";
import { useTranslation } from 'react-i18next';
import { useAnalyics } from '../../../hooks/useAnalytics';
const AnalyticsSection = ({ sectionId, title, renderData, dataState, onReset, registerRef }) => {
  const { t } = useTranslation();

  return (
    <section id={sectionId} ref={(el) => registerRef(sectionId, el)} className={styles[sectionId]}>
      {dataState.loading && (
        <div className={styles.analyticsContentLoader}>
          <Loader />
        </div>
      )}
      {dataState.error && (
        <div className={styles.analyticsContentLoader}>
          <Error text={dataState.error}/>
        </div>
      )}
      {!dataState.error && !dataState.loading && dataState.data != null && dataState.data?.length > 0 && (
        renderData(dataState.data, title)
      )}
      {!dataState.error && !dataState.loading && (dataState.data == null || dataState.data?.length == 0) && (
        <div className={styles.assetNoFind}>
          <span>
            {t("analytics.section.dataUnavailable", { title: title.toLowerCase() })}
          </span>
          {onReset && <button className={styles.reset} onClick={onReset}> {t("analytics.section.reset")}</button>}
        </div>
      )}
    </section>
  );
};

export default AnalyticsSection;