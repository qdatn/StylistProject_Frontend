// pages/admin/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import ProductTable from '../product/ProductTable';
import mockProducts, { Product } from '@src/types/Product';
import CardItem from '@components/statistic/CardItem';
import { calculateStats } from '@utils/calculateStats';
import DashboardCharts from '@components/statistic/DashboardChart';
import StatsSummary from '@components/statistic/StatsSummary';
interface StatsSummaryProps {
  startDate: Date;
  endDate: Date;
}
const DashboardPage: React.FC<StatsSummaryProps> = ({ startDate, endDate }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const { totalRevenue, totalOrders, avgOrderValue, totalProducts, totalSold } = calculateStats(
    startDate, endDate
  );

  return (

    <div className="p-6 bg-gray-100 min-h-screen">
      <div className='text-2xl font-bold mb-6'>General</div>
      {/* Thông tin kinh doanh */}
      <div className="col-span-1 bg-white p-6 rounded-lg shadow">
        <div className="mt-6">
          <StatsSummary startDate={new Date('2023-01-01')} endDate={new Date('2025-01-01')} />
        </div>
      </div>

      {/* Biểu đồ doanh thu */}
      <div className="mt-6 col-span-2 bg-white p-6 rounded-lg shadow">
        <div className="">
          <DashboardCharts startDate={new Date('2023-01-01')} endDate={new Date('2025-01-01')} filterType={'custom'} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;