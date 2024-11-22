import  mockProducts  from "./Product";
import mockOrders from "./Order";

/**
 * Get revenue-related statistics.
 */
export const getRevenueStatistics = () => {
  const totalOrders = mockOrders.length;
  const totalRevenue = mockOrders.reduce((total, order) => total + order.total_price, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return { totalOrders, totalRevenue, averageOrderValue };
};

/**
 * Get product-related statistics.
 */
export const getProductStatistics = () => {
  const totalStock = mockProducts.reduce((total, product) => total + product.stock_quantity, 0);
  const totalSoldQuantity = mockProducts.reduce(
    (total, product) => total + (product.sold_quantity || 0),
    0
  );
  const totalNetRevenue = mockProducts.reduce(
    (total, product) => total + (product.sold_quantity || 0) * product.discountedPrice,
    0
  );

  return { totalStock, totalSoldQuantity, totalNetRevenue };
};

/**
 * Combines all statistics for the dashboard.
 */
export const getDashboardStatistics = () => {
  const revenueStats = getRevenueStatistics();
  const productStats = getProductStatistics();
  return { ...revenueStats, ...productStats };
};
