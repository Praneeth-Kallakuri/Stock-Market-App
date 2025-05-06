// components/StockChart.tsx
import React from 'react';

interface ChartDataPoint {
  price: number;
  color: string;
}

interface StockChartProps {
  chartData: ChartDataPoint[];
}

const StockChart: React.FC<StockChartProps> = ({ chartData }) => {
  return (
    <div className="stock-chart">
      <div className="chart-container">
        {chartData.map((data, index) => (
          <div 
            key={index}
            className="chart-bar"
            style={{
              height: `${(data.price / 500) * 100}%`,
              backgroundColor: data.color,
              left: `${index * 22}px`,
              width: `20px`,
              margin: '0px',
            }}
          />
        ))}
        {/* Grid lines */}
        <div className="grid-lines">
          {[0, 100, 200, 300, 400, 500].map((line) => (
            <div
              key={line}
              className="grid-line"
              style={{ bottom: `${(line / 500) * 100}%` }}
            >
              <span className="grid-label">{line}</span>
            </div>
          ))}
        </div>
        <div className="vertical-grid-lines">
          {[0, 100, 200, 300, 400, 500, 600, 700].map((index) => (
            <div
              key={index}
              className="vertical-grid-line"
              style={{ left: `${(index / 700) * 100}%` }}
            >
              <span className="vertical-grid-label">{index}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockChart;