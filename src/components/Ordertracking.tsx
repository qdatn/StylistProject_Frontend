// components/Ordertracking.tsx
import React, { useState } from "react";
import OrderItemPage from "@components/OrderItem";
import { Order, OrderTracking } from "@src/types/Order";
import OrderReviewForm from "./OrderReview";
import { OrderItem } from "@src/types/OrderItem";
import { formatCurrency } from "@utils/format";
import OrderDetailModal from "./OrderDetailModal";

interface OrdertrackingProps {
  order: Order;
  orderitems: OrderItem[];
}

const Ordertracking: React.FC<OrdertrackingProps> = ({ order, orderitems }) => {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  console.log("ODDEDASD", order);
  console.log("ODDEDASD ITEM", orderitems);
  return (
    <div className="order-tracking border p-4 mb-4 rounded-lg shadow text-gray-700">
      {/* Trạng thái đơn hàng */}
      <div className="order-status mb-4 flex justify-end items-center border-b pb-2">
        <span className="text-lg font-semibold text-gray-600">
          {order.status.toUpperCase()}
        </span>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="order-items mb-4">
        {orderitems &&
          orderitems.map((item) => (
            <OrderItemPage key={item._id} item={item} />
          ))}
      </div>

      {/* Tổng tiền - căn phải */}
      <div className="order-total flex justify-end pt-4">
        <span className="text-base font-normal mr-2">Discount:</span>
        <span className="text-base font-bold text-gray-700">
          - {formatCurrency(order?.discount)}
        </span>
         
      </div>
      <div className="order-total flex justify-end pt-4">
        <span className="text-lg font-medium mr-2">Total:</span>
        <span className="text-lg font-semibold text-gray-700">
          {formatCurrency(order.total_price)}
        </span>
      </div>

      {/* Nút hành động */}
      <div className="order-actions mt-4 flex justify-end gap-4">
        {order.status === "delivered" && (
          <button
            className="bg-gray-300 px-10 py-2 rounded font-semibold"
            onClick={() => setIsReviewFormOpen(true)}
          >
            Review
          </button>
        )}
        <button
          className="bg-gray-800 text-white px-10 py-2 rounded font-semibold"
          onClick={() => setIsDetailModalOpen(true)}
        >
          Detail
        </button>
      </div>

      {/* Modal Overlay for Review Form */}
      {isReviewFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <OrderReviewForm
            order={order}
            orderitems={orderitems}
            onClose={() => setIsReviewFormOpen(false)}
          />
        </div>
      )}
      {/* Modal Chi Tiết Đơn Hàng */}
      {isDetailModalOpen && (
        <OrderDetailModal
          order={order}
          orderitems={orderitems}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Ordertracking;
