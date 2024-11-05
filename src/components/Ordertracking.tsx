// components/Ordertracking.tsx
import React from 'react';
import OrderItem from '@components/OrderItem';
import { Order } from '@models/Order';

interface OrdertrackingProps {
  order: Order;
}

const Ordertracking: React.FC<OrdertrackingProps> = ({ order }) => {
  return (
    <div className="order-tracking border p-4 mb-4 rounded-lg shadow text-gray-700">
      <div className="order-status mb-2">
        <span className="text-sm">Giao hàng thành công</span>
        <span className="font-bold ml-2">{order.status.toUpperCase()}</span>
      </div>
      <div className="order-items">
        {order.order_items.map(item => (
          <OrderItem key={item.product_id} item={item} />
        ))}
      </div>
      <div className="order-total mt-2">
        <span>Thành tiền: </span>
        <span className="font-bold text-red-500">£{order.total_price.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default Ordertracking;