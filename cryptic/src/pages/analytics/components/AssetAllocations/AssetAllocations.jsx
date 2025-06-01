import { Chart as ChartJS, ArcElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler } from "chart.js";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2"
import styles from "./AssetAllocations.module.css";
import Reset from "../../../../components/common/Reset/Reset";
import assetsIcon from "../../../../assets/images/Dashboard/assetsIcon.svg";
import Loader from "../../../../components/common/Loader/Loader";

const options = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: 10,
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      mode: "nearest",
      intersect: false,
      backgroundColor: "#4C4C4CFF",
      titleColor: "#fff",
      bodyColor: "#fff",
      padding: 5,
      displayColors: false,
      position: 'average',
      callbacks: {
        label: function(tooltipItem) {
          return tooltipItem.raw + '%';
        }
      }
    },
  },
};

export default function AssetAllocations({ data }) {
  ChartJS.register(ArcElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler);
  const [assets, setAssets] = useState([]);
  const [dataForChart, setDataForChart] = useState(null);
  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {

      const assetLabels = data.map((coin) => coin.symbol);
      const assetData = data.map((coin) => parseFloat(coin.percentage));
  
      const baseColors = ["#59588D", "#FFC205", "#FF3737", "#9747FF", "#00C300", "#FF9F40"];
      const getColor = (index) => baseColors[index % baseColors.length];
  
      const newAssets = assetLabels.map((symbol, index) => ({
        symbol,
        interest: assetData[index],
        color: getColor(index),
      }
    ));
      
      // Make sure we have valid data before setting it
      if (assetLabels.length > 0 && assetData.length > 0) {
        setDataForChart({
          labels: assetLabels,
          datasets: [
            {
              label: "Asset Allocation",
              data: assetData,
              backgroundColor: newAssets.map((asset) => asset.color),
              borderColor: "#11141E",
              borderWidth: 2,
              hoverOffset: 20,
              cutout: "75%", 
            },
          ],
        });
      }
  
      setAssets(newAssets);

    }
  }, [data]);
  
  // Find the asset with the highest percentage
  const greatestAsset = assets.length > 0 
    ? assets.reduce((prev, current) => 
        (prev.interest > current.interest) ? prev : current
      )
    : null;

  return (
    <>

        <div className={styles.assetAllocationWrapper}>
          <div className={styles.chartAsset}>
              {dataForChart ? (
                <>
                  <Doughnut data={dataForChart} options={options} />
                  <div className={styles.greatestValue}>
                    <div className={styles.greatestValueName}>
                      <img 
                        className={assetsIcon ? styles.assetsIcon : styles.hidden} 
                        src={assetsIcon} 
                        alt={greatestAsset?.symbol || "Asset"}
                      />
                      <span>{greatestAsset?.symbol || "N/A"}</span>
                    </div>
                    <div>$ 268379</div>
                    <div>{greatestAsset?.interest || "0"}%</div> 
                  </div>
                </>
                ) : (
                  <Loader text="Loading chart"/>
                )}

          </div>
          <div className={styles.assets}>
            <div className={styles.topic}>Asset Allocations</div>
            <div className={`${styles.assetsList} ${assets?.length > 6 ? styles.twoColumns : ''}`}>
              <ul>                                  
                {assets?.map((asset, index) => (
                  <li className={styles.assetListElement} key={index}>
                    <div className={styles.assetName}>
                      <span>{asset.symbol}</span>
                    </div>
                    <div className={styles.assetInterest}>
                      <span>{asset.interest} %</span>
                      <div
                        className={styles.assetColor}
                        style={{ backgroundColor: asset.color }}
                      ></div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
    </>
  );
}