import { calculateStats } from '@utils/calculateStats';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

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

interface DashboardChartsProps {
  startDate: Date;
  endDate: Date;
  filterType: string; // Thêm filterType
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ startDate, endDate, filterType }) => {
  const { filteredOrders } = calculateStats(startDate, endDate);

  // Sắp xếp các orders theo ngày tạo (create_date)
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateA - dateB; // Sắp xếp theo thứ tự tăng dần
  });

  // Nhóm dữ liệu dựa trên filterType (ngày, tháng, năm)
  const groupByDate = (date: Date) => {
    if (filterType === 'year') {
      return date.toLocaleString('default', { month: 'long' }); // Tháng
    }
    return date.toLocaleDateString(); // Ngày
  };

  // Xử lý dữ liệu nhóm theo filterType
  const groupedData = sortedOrders.reduce((acc, order) => {
    const orderDate = new Date(order.createdAt|| 0);
    const key = groupByDate(orderDate);

    if (!acc[key]) {
      acc[key] = { revenue: 0, orderCount: 0, avgValue: 0 };
    }

    acc[key].revenue += order.total_price;
    acc[key].orderCount += 1;
    acc[key].avgValue = acc[key].revenue / acc[key].orderCount;

    return acc;
  }, {} as Record<string, { revenue: number; orderCount: number; avgValue: number }>);

  // Chuẩn bị dữ liệu cho biểu đồ
  const labels = Object.keys(groupedData);
  const revenueData = labels.map((key) => groupedData[key].revenue);
  const orderCounts = labels.map((key) => groupedData[key].orderCount);
  const avgOrderValues = labels.map((key) => groupedData[key].avgValue);

  // Biểu đồ doanh thu
  const revenueChartData = {
    labels,
    datasets: [
      {
        label: 'Revenue',
        data: revenueData,
        borderColor: '#36A2EB', // Line color
        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Light fill color under the line
        fill: true, // Filling under the line
        tension: 0.4, // Makes the line smooth and soft
        borderWidth: 2,
      },
    ],
  };

  // Biểu đồ giá trị đơn hàng trung bình
  const avgOrderValueChartData = {
    labels,
    datasets: [
      {
        label: 'Average Order Value',
        data: avgOrderValues,
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4, // Smooth the line
        borderWidth: 2,
      },
    ],
  };

  // Biểu đồ số lượng đơn hàng
  const orderCountChartData = {
    labels,
    datasets: [
      {
        label: 'Number of Orders',
        data: orderCounts,
        borderColor: '#4BC0C0',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4, // Smooth the line
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Biểu đồ doanh thu */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Revenue Over Time</h3>
        <Line data={revenueChartData} />
      </div>

      {/* Biểu đồ giá trị đơn hàng trung bình */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Average Order Value</h3>
        <Line data={avgOrderValueChartData} />
      </div>

      {/* Biểu đồ số lượng đơn hàng */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Number of Orders</h3>
        <Line data={orderCountChartData} />
      </div>
    </div>
  );
};

export default DashboardCharts;
