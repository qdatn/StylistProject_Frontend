// utils/filterOrdersByDate.ts
import mockOrders, { Order } from "@src/types/Order";

/**
 * Filters orders by date range.
 */
export const filterOrdersByDate = (orders: Order[], startDate: Date, endDate: Date) => {
    return orders.filter(order => {
        const orderDate = order.createdAt? new Date(order.createdAt) : new Date();
        return orderDate >= startDate && orderDate <= endDate;
    });
};