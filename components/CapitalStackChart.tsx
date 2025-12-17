import React from 'react';
import { ChartDataPoint } from '../types';

interface CapitalStackChartProps {
  data: ChartDataPoint[];
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

const CapitalStackChart: React.FC<CapitalStackChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }
  
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">No funding sources to display in chart.</p>;
  }

  const gradientParts: string[] = [];
  let cumulativePercent = 0;

  data.forEach(item => {
    const percent = (item.value / total) * 100;
    gradientParts.push(`${item.color} ${cumulativePercent}% ${cumulativePercent + percent}%`);
    cumulativePercent += percent;
  });

  const conicGradient = `conic-gradient(${gradientParts.join(', ')})`;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div 
        className="w-40 h-40 rounded-full flex-shrink-0"
        style={{ background: conicGradient }}
        role="img"
        aria-label="Capital stack breakdown pie chart"
      />
      <div className="w-full">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Funding Sources</h4>
        <ul className="space-y-2">
          {data.map(item => (
            <li key={item.name} className="flex justify-between items-center text-sm">
              <div className="flex items-center">
                <span 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-600 dark:text-gray-300">{item.name}</span>
              </div>
              <span className="font-semibold text-gray-800 dark:text-white">{formatCurrency(item.value)}</span>
            </li>
          ))}
          <li className="flex justify-between items-center text-sm font-bold border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
             <span className="text-gray-800 dark:text-white">Total</span>
             <span className="text-gray-800 dark:text-white">{formatCurrency(total)}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CapitalStackChart;
