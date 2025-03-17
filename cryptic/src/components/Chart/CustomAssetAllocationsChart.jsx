import {
  Chart as ChartJS,
  ArcElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
  Legend 
} from "chart.js";

const options = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: 10, // Додаємо відступи, щоб не обрізало
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
      position: 'average', // Можна використати 'nearest' або 'average' для зміщення
      callbacks: {
        label: function(tooltipItem) {
          return tooltipItem.raw + '%'; // Показує відсоток або іншу інформацію в тултіп
        }
      }
    },
  },
};

export default function CustomPieChart(data) {
  ChartJS.register(ArcElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler);


  return (
    <>
      <Doughnut data={data} options={options} onElementsClick={(elems) => console.log(elems)} /> 
    </>
  );
}
