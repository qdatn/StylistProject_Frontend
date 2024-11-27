import React from 'react';
import OrderItem from '@components/OrderItem'; // Giả sử `OrderItem` là component hiển thị sản phẩm trong đơn hàng
import { OrderTracking } from '@src/types/Order'; // Sử dụng interface bạn đã cung cấp

interface OrdertrackingProps {
  orderTracking: OrderTracking; // Nhận đối tượng `OrderTracking` với dữ liệu đầy đủ
}

const OrdertrackingAdmin: React.FC<OrdertrackingProps> = ({ orderTracking }) => {
  const { order, order_items } = orderTracking; // Lấy dữ liệu `order` và `order_items` từ `orderTracking`

  return (
    <div className="order-tracking border p-4 mb-4 rounded-lg shadow text-gray-700">
      {/* Trạng thái đơn hàng */}
      <div className="order-status mb-4 flex justify-end items-center border-b pb-2">
        <span className="text-lg font-semibold text-gray-600">{order.status.toUpperCase()}</span>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="order-items mb-4">
        {order_items.map((item) => (
          <OrderItem key={item.product._id} item={item} /> // Giả sử `OrderItem` sử dụng `item` là sản phẩm
        ))}
      </div>

      {/* Tổng tiền - căn phải */}
      <div className="order-total flex justify-end pt-4">
        <span className="text-lg font-medium mr-2">Total Price:</span>
        <span className="text-lg font-bold text-red-500">£{order.total_price.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrdertrackingAdmin;
