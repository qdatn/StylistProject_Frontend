import React, { useState } from 'react';
import DateRangePicker from '@components/statistic/DateRangePicker';
import StatsSummary from '@components/statistic/StatsSummary';
import DashboardCharts from '@components/statistic/DashboardChart';


const Dashboard: React.FC = () => {
  const [startDate, setStartDate] = useState(new Date('2023-01-01'));
  const [endDate, setEndDate] = useState(new Date());
  const [filterType, setFilterType] = useState('custom'); // Default filter type

  const handleDateChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleFilterTypeChange = (type: string) => {
    setFilterType(type);

    const today = new Date();
    switch (type) {
      case 'week':
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        handleDateChange(startOfWeek, endOfWeek);
        break;
      case 'month':
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        handleDateChange(startOfMonth, endOfMonth);
        break;
      case 'quarter':
        const quarter = Math.floor(today.getMonth() / 3);
        const startOfQuarter = new Date(today.getFullYear(), quarter * 3, 1);
        const endOfQuarter = new Date(today.getFullYear(), quarter * 3 + 3, 0);
        handleDateChange(startOfQuarter, endOfQuarter);
        break;
      case 'year':
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        const endOfYear = new Date(today.getFullYear(), 11, 31);
        handleDateChange(startOfYear, endOfYear);
        break;
      default:
        break;
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Statistic Page</h1>
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onDateChange={handleDateChange}
        onFilterTypeChange={handleFilterTypeChange}
      />
      <div className="mt-6">
        <StatsSummary startDate={startDate} endDate={endDate} />
      </div>
      <div className="mt-6">
        <DashboardCharts startDate={startDate} endDate={endDate} filterType={filterType} />
      </div>
    </div>
  );
};

export default Dashboard;
