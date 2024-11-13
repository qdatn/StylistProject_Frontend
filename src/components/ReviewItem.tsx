// components/ReviewItem.tsx
import React, { useState } from 'react';
import { OrderItem } from '@src/types/OrderItem';
import { FaStar } from 'react-icons/fa';

interface ReviewItemProps {
  item: OrderItem;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ item }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  return (
    <div className="review-item border-b py-4 pr-2 pl-2">
      {/* Tên sản phẩm */}
      <h4 className="font-semibold mb-2">{item.product_name}</h4>
      
      {/* Attributes (e.g., color, size) */}
      <div className="text-sm text-gray-600 mb-2">
        {item.attributes.map(attr => (
          <span key={attr.key} className="mr-2">
            {attr.key}: {attr.value}
          </span>
        ))}
      </div>

      {/* Rating System */}
      <div className="rating mb-2 flex flex-row items-center gap-0.5">
        <span className="text-sm">Rating:</span>
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`cursor-pointer ${index < rating ? 'text-yellow-500' : 'text-gray-300'}`}
            onClick={() => setRating(index + 1)}
          >
          <FaStar />
          </span>
        ))}
      </div>

      {/* Comment Field */}
      <div >
        <label className="block text-sm mb-2">Comment</label>
        <textarea
          className="w-full p-3 border rounded"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
        />
      </div>
    </div>
  );
};

export default ReviewItem;