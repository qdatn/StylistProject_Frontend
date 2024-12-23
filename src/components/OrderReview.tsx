import React from "react";
import { Order } from "@src/types/Order";
import ReviewItem from "./ReviewItem";
import { OrderItem } from "@src/types/OrderItem";


interface OrderReviewFormProps {
  order: Order;
  orderitems: OrderItem[];
  onClose: () => void;
}

const OrderReviewForm: React.FC<OrderReviewFormProps> = ({
  orderitems,
  order,
  onClose,
}) => {
  // Close the form when clicking outside of it
  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };
  

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30"
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-3 rounded-lg shadow-lg w-full max-w-lg relative">
        <div className=" font-semibold text-xl text-gray-800 pl-3">Review</div>
        <button
          className="absolute top-0 right-4 text-gray-300 hover:text-gray-800 text-3xl"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Scrollable container for items */}
        <div
          className="overflow-y-auto max-h-80" // Thêm margin-top thay vì padding-top
          style={{
            scrollbarWidth: "thin" /* Firefox */,
            scrollbarColor: "#888 #f1f1f1" /* Firefox */,
          }}
        >
          {/* For Chrome, Safari */}
          <style>
            {`
              .overflow-y-auto::-webkit-scrollbar {
                width: 8px;
              }
              .overflow-y-auto::-webkit-scrollbar-thumb {
                background-color: #888;
                border-radius: 4px;
              }
              .overflow-y-auto::-webkit-scrollbar-track {
                background-color: #f1f1f1;
              }
            `}
          </style>
          {orderitems &&
            orderitems.map((item) => (
              <div>
                <ReviewItem item={item} />
                
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default OrderReviewForm;
