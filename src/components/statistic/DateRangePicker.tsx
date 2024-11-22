import { Input } from 'antd';
import React, { useState } from 'react';

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onDateChange: (start: Date, end: Date) => void;
  onFilterTypeChange: (type: string) => void; // Add new prop
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onDateChange,
  onFilterTypeChange,
}) => {
  const [filterType, setFilterType] = useState('custom'); // Default to custom

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value;
    setFilterType(selectedType);
    onFilterTypeChange(selectedType); // Notify parent about filter type
  };

  return (
    <div className="flex items-center gap-4">
      <div>
        <div className="block text-sm font-medium ">Filter Type</div>
        <select
          value={filterType}
          onChange={handleFilterChange}
          className="border rounded-md text-sm p-2"
        >
          <option value="custom">Custom Range</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {filterType === 'custom' && (
        <>
          <div>
            <label className="block text-sm font-medium">Start Date</label>
            <Input
              type="date"
              value={startDate.toISOString().substring(0, 10)}
              onChange={(e) => onDateChange(new Date(e.target.value), endDate)}
              className="border px-2 py-1 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">End Date</label>
            <Input
              type="date"
              value={endDate.toISOString().substring(0, 10)}
              onChange={(e) => onDateChange(startDate, new Date(e.target.value))}
              className="border px-2 py-1 rounded-md"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DateRangePicker;
