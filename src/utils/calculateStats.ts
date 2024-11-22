import mockOrders from "@src/types/Order";
import mockProducts from "@src/types/Product";
import { filterOrdersByDate } from "./filterOrdersByDate";


export const calculateStats = (startDate: Date, endDate: Date) => {
    const filteredOrders = filterOrdersByDate(mockOrders, startDate, endDate);
  
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total_price, 0);
    const totalOrders = filteredOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
    const totalProducts = mockProducts.reduce((sum, product) => sum + product.stock_quantity, 0);
    const totalSold = mockProducts.reduce((sum, product) => {
      if (product.sold_quantity !== undefined) {
        return sum + product.sold_quantity;
      }
      return sum;
    }, 0);
  
    return { totalRevenue, totalOrders, avgOrderValue, totalProducts, totalSold, filteredOrders };
  };