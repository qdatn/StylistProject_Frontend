// pages/admin/DashboardPage.tsx
import React from 'react';

const DashboardPage = () => {
  return (
    
      <div className="grid grid-cols-3 gap-4">
        {/* Thông tin kinh doanh */}
        <div className="col-span-1 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold">Result</h2>
          <p className="text-3xl text-yellow-500 font-semibold">00,000đ</p>
          {/* Thêm các thông tin khác tương tự */}
        </div>

        {/* Biểu đồ doanh thu */}
        <div className="col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold">Chart Revenue</h2>
          {/* Thêm biểu đồ hoặc ảnh biểu đồ tại đây */}
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Thống kê truy cập */}
        <div className="col-span-3 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold"></h2>
          {/* Thêm thống kê hoặc bảng dữ liệu tại đây */}
          <div className="h-48 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
  );
};

export default DashboardPage;