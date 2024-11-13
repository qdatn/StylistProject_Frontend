// components/Ordertracking.tsx
import React, { useState } from 'react';
import OrderItem from '@components/OrderItem';
import { Order } from '@src/types/Order';
import OrderReviewForm from './OrderReview';

interface OrdertrackingProps {
  order: Order;
}

const Ordertracking: React.FC<OrdertrackingProps> = ({ order }) => {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

  return (
    <div className="order-tracking border p-4 mb-4 rounded-lg shadow text-gray-700">
      {/* Trạng thái đơn hàng */}
      <div className="order-status mb-4 flex justify-end items-center border-b pb-2">
        <span className="text-lg font-semibold text-gray-600">{order.status.toUpperCase()}</span>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="order-items mb-4">
        {order.order_items.map(item => (
          <OrderItem key={item.product_id} item={item} />
        ))}
      </div>

      {/* Tổng tiền - căn phải */}
      <div className="order-total flex justify-end pt-4">
        <span className="text-lg font-medium mr-2">Thành tiền:</span>
        <span className="text-lg font-bold text-red-500">£{order.total_price.toFixed(2)}</span>
      </div>

      {/* Nút hành động */}
      <div className="order-actions mt-4 flex justify-end gap-4">
        <button
          className="bg-gray-300 px-10 py-2 rounded font-semibold"
          onClick={() => setIsReviewFormOpen(true)}
        >
          Review
        </button>
        <button className="bg-gray-800 text-white px-10 py-2 rounded font-semibold">Detail</button>
      </div>

      {/* Modal Overlay for Review Form */}
      {isReviewFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <OrderReviewForm order={order} onClose={() => setIsReviewFormOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default Ordertracking;
