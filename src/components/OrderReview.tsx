import React from 'react';
import { Order } from '@src/types/Order';
import ReviewItem from './ReviewItem';

interface OrderReviewFormProps {
  order: Order;
  onClose: () => void;
}

const OrderReviewForm: React.FC<OrderReviewFormProps> = ({ order, onClose }) => {
  // Close the form when clicking outside of it
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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
        <div className=' font-semibold text-xl text-gray-800 pl-3'>Review</div>
        <button 
          className="absolute top-0 right-4 text-gray-300 hover:text-gray-800 text-3xl"
          onClick={onClose}
        >
          &times;
        </button>
        
        {/* Scrollable container for items */}
        <div 
          className="overflow-y-auto max-h-80"  // Thêm margin-top thay vì padding-top
          style={{
            scrollbarWidth: 'thin', /* Firefox */
            scrollbarColor: '#888 #f1f1f1', /* Firefox */
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
          {order.order_items.map(item => (
            <ReviewItem item={item} />
          ))}
        </div>

        {/* Submit & Cancel Buttons */}
        <div className="flex justify-end mt-4 gap-4">
          <button className="bg-gray-800 text-white px-10 py-2 rounded font-semibold hover:bg-gray-500">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default OrderReviewForm;
