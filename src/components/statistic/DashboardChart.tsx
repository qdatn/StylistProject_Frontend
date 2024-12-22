import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axiosClient from "@api/axiosClient";

// Registering the necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Order {
  createdAt: string;  // Assuming the order has a 'createdAt' field of type string
  total_price: number;
  [key: string]: any;  // To allow additional properties if needed
}
interface ApiResponse {
  orders: any[]; // Thay `any` bằng kiểu dữ liệu cụ thể nếu bạn biết
}
interface DashboardChartsProps {
  startDate: Date;
  endDate: Date;
  filterType: string; // Added filterType
}
const baseUrl = import.meta.env.VITE_API_URL;

const DashboardCharts: React.FC<DashboardChartsProps> = ({ startDate, endDate, filterType }) => {
  const [orderData, setOrderData] = useState<Order[] | null>(null); // State to store the fetched data

  // Filter orders by date range
  const filterOrdersByDate = (orders: Order[], startDate: Date, endDate: Date) => {
    return orders.filter(order => {
      const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
      return orderDate >= startDate && orderDate <= endDate;
    });
  };

  // Fetch order data from the API
  const fetchOrders = async () => {
    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];
  
    try {
      const response = await axiosClient.getOne(
        `${baseUrl}/api/statistic/order?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
        {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        }
      ) as ApiResponse;
  
      // Log the response to check its structure
      console.log('API Response:', response);
  
      // Assuming the response has a 'data' field that contains an array of orders
      const orders = response.orders || []; // Ensure orders is an array
      
      if (!Array.isArray(orders)) {
        throw new Error('Expected response data to be an array of orders');
      }
  
      // Filter orders by date range
      const filteredOrders = filterOrdersByDate(orders, startDate, endDate);
  
      // Sorting orders by the 'createdAt' field
      const sortedOrders = [...filteredOrders].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateA - dateB; // Sorting by ascending order
      });
  
      setOrderData(sortedOrders);
      console.log(sortedOrders);
    } catch (error) {
      console.error("Error fetching order data", error);
    }
  };

  // Effect to fetch and set order data when the date range changes
  useEffect(() => {
    if (startDate && endDate) {
      fetchOrders();
    }
  }, [startDate, endDate]);

  if (!orderData) {
    return <div>Loading...</div>; // Display loading while data is being fetched
  }

  // Grouping logic based on the filterType
  const groupByDate = (date: Date) => {
    if (filterType === 'year') {
      return date.toLocaleString('default', { month: 'long' }); // Group by month for 'year' filter
    }
    return date.toLocaleDateString(); // Group by day for 'day' filter
  };

  const groupedData = orderData.reduce((acc: any, order: any) => {
    const orderDate = new Date(order.createdAt || 0);
    const key = groupByDate(orderDate);

    if (!acc[key]) {
      acc[key] = { revenue: 0, orderCount: 0, avgValue: 0 };
    }

    acc[key].revenue += order.total_price;
    acc[key].orderCount += 1;
    acc[key].avgValue = acc[key].revenue / acc[key].orderCount;

    return acc;
  }, {});

  // Prepare chart data
  const labels = Object.keys(groupedData);
  const revenueData = labels.map((key) => groupedData[key].revenue);
  const orderCounts = labels.map((key) => groupedData[key].orderCount);
  const avgOrderValues = labels.map((key) => groupedData[key].avgValue);

  const revenueChartData = {
    labels,
    datasets: [
      {
        label: 'Revenue',
        data: revenueData,
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  };

  const avgOrderValueChartData = {
    labels,
    datasets: [
      {
        label: 'Average Order Value',
        data: avgOrderValues,
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  };

  const orderCountChartData = {
    labels,
    datasets: [
      {
        label: 'Number of Orders',
        data: orderCounts,
        borderColor: '#4BC0C0',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Revenue Over Time Chart */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Revenue Over Time</h3>
        <Line data={revenueChartData} />
      </div>

      {/* Average Order Value Chart */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Average Order Value</h3>
        <Line data={avgOrderValueChartData} />
      </div>

      {/* Number of Orders Chart */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Number of Orders</h3>
        <Line data={orderCountChartData} />
      </div>
    </div>
  );
};

export default DashboardCharts;
