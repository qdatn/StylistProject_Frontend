import React from 'react';
import CardItem from './CardItem';
import { calculateStats } from '@utils/calculateStats';

interface StatsSummaryProps {
  startDate: Date;
  endDate: Date;
}

const StatsSummary: React.FC<StatsSummaryProps> = ({ startDate, endDate }) => {
  const { totalRevenue, totalOrders, avgOrderValue, totalProducts, totalSold } = calculateStats(
    startDate,
    endDate
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <CardItem title="Total Products in Stock" value={totalProducts} />
      <CardItem title="Total Products Sold" value={totalSold} />
      <CardItem title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} />
      <CardItem title="Total Orders" value={totalOrders} />
      <CardItem title="Average Order Value" value={`$${avgOrderValue.toFixed(2)}`} />
    </div>
  );
};

export default StatsSummary;
