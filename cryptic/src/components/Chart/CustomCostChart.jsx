import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useState } from 'react';

// Генератор кольорів HSL для унікальних відтінків
const generateColors = (count) => {
  return Array.from({ length: count }, (_, i) => `hsl(${(i * 360) / count}, 70%, 50%)`);
};

const data = [
  { name: 'Category A', value: 400 },
  { name: 'Category B', value: 300 },
  { name: 'Category C', value: 300 },
  { name: 'Category D', value: 200 },
  { name: 'Category E', value: 350 },
  { name: 'Category F', value: 250 },
];

const COLORS = generateColors(data.length);

export default function CustomPieChart() {
  const [selected, setSelected] = useState(null);

  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div>
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          dataKey="value"
          onMouseEnter={(entry, index) => setSelected({ color: COLORS[index], percent: ((entry.value / total) * 100).toFixed(1) })}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>

      {selected && (
        <div style={{ color: selected.color, fontWeight: 'bold' }}>
          Color from chart: {selected.color} ({selected.percent}%)
        </div>
      )}
    </div>
  );
}
