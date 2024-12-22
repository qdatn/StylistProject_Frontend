import React, { useEffect, useState } from "react";
import CardItem from "./CardItem";
import { formatCurrency } from "@utils/format";

interface StatsSummaryProps {
  startDate: Date;
  endDate: Date;
}

const StatsSummary: React.FC<StatsSummaryProps> = ({ startDate, endDate }) => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalSold: 0,
  });

  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const formattedStartDate = startDate.toISOString().split("T")[0];
        const formattedEndDate = endDate.toISOString().split("T")[0];

        // Gọi API để lấy thống kê
        const response = await fetch(
          `${baseUrl}/api/statistic/revenue?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
        );
        
        // Kiểm tra mã trạng thái và dữ liệu trả về
        if (response.ok) {
          const data = await response.json();

          console.log("Received data:", data);

          // Kiểm tra nếu dữ liệu trả về hợp lệ
          setStats({
            totalRevenue: data?.data?.totalRevenue ?? 0, // Nếu không có dữ liệu, trả về 0
            totalOrders: data?.data?.totalOrders ?? 0,
            totalProducts: data?.data?.totalProducts ?? 0,
            totalSold: data?.data?.totalSoldProducts ?? 0,
          });
        } else {
          console.error("Failed to fetch statistics, status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStats();
  }, [startDate, endDate, baseUrl]);

  const { totalRevenue, totalOrders, totalProducts, totalSold } = stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <CardItem title="Total Products in Stock" value={totalProducts} />
      <CardItem title="Total Products Sold" value={totalSold} />
      <CardItem
        title="Total Revenue"
        value={formatCurrency(totalRevenue)} // Đảm bảo totalRevenue không phải undefined
      />
      <CardItem title="Total Orders" value={totalOrders} />
    </div>
  );
};

export default StatsSummary;
