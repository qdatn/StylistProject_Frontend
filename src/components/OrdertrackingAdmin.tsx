// components/Ordertracking.tsx
import React, { useState } from 'react';
import OrderItem from '@components/OrderItem';
import { Order } from '@src/types/Order';

interface OrdertrackingProps {
  order: Order;
}

const OrdertrackingAdmin: React.FC<OrdertrackingProps> = ({ order }) => {

  return (
    <div className="order-tracking border p-4 mb-4 rounded-lg shadow text-gray-700">
      {/* Trạng thái đơn hàng */}
      <div className="order-status mb-4 flex justify-end items-center border-b pb-2">
        <span className="text-lg font-semibold text-gray-600">{order.status.toUpperCase()}</span>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="order-items mb-4">
        {order.order_items.map(item => (
          <OrderItem item={item} />
        ))}
      </div>

      {/* Tổng tiền - căn phải */}
      <div className="order-total flex justify-end pt-4">
        <span className="text-lg font-medium mr-2">Thành tiền:</span>
        <span className="text-lg font-bold text-red-500">£{order.total_price.toFixed(2)}</span>
      </div>

      
    </div>
  );
};

export default OrdertrackingAdmin;
