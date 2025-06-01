import Loader from '../../../../components/common/Loader/Loader';
import Error from '../../../../components/common/Error/Error';
import styles from "./AnalyticsSection.module.css";
const AnalyticsSection = ({ sectionId, title, dataState, renderData, onReset, registerRef }) => {
  

  return (
    <section id={sectionId} ref={(el) => registerRef(sectionId, el)} className={styles[sectionId]}>
      {dataState.loading && (
        <div className={styles.analyticsContentLoader}>
          <Loader />
        </div>
      )}

      {dataState.error && (
        <div className={styles.analyticsContentLoader}>
          <Error />
        </div>
      )}

      {!dataState.error && !dataState.loading && dataState.data != null && dataState.data?.length > 0 && (
        renderData(dataState.data)
      )}

      {!dataState.error && !dataState.loading && (dataState.data == null || dataState.data?.length == 0) && (
        <div className={styles.assetNoFind}>
          <span>
            Sorry, we couldn't retrieve {title.toLowerCase()} data for your portfolio.
            Please make sure you’ve added at least one wallet, or try again later.
          </span>
          {onReset && <button className={styles.reset} onClick={onReset}>Reset Now</button>}
        </div>
      )}
    </section>
  );
};

export default AnalyticsSection;