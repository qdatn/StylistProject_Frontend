import React, { useEffect, useState } from "react";
import { OrderItem } from "@src/types/OrderItem";
import { FaStar } from "react-icons/fa";

import axiosClient from "@api/axiosClient";
import { Comment } from "@src/types/Comment";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { Attribute } from "@src/types/Attribute";

interface ReviewItemProps {
  item: OrderItem;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ item }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [attributes, setAttributes] = useState<Attribute[]>();

  const handleRatingClick = (index: number) => {
    setRating(index + 1); // Cập nhật rating khi click vào sao
  };
  console.log("ITEMATTR", item.attributes);

  const baseUrl = import.meta.env.VITE_API_URL;
  const user = useSelector((state: RootState) => state.persist.auth.user);

  const handleComment = async () => {
    try {
      const commentData: Comment = {
        product: item.product,
        user: user?.user._id,
        rating: rating,
        review: comment,
        attributes: item.attributes,
      };
      const addComment = await axiosClient.post(
        `${baseUrl}/api/comment`,
        commentData
      );
      console.log("CMMT", addComment);
      alert("Comment success");
    } catch (error) {}
  };

  return (
    <div className="review-item border-b py-4 px-2">
      {/* Tên sản phẩm */}
      <h4 className="font-semibold mb-2">{item.product.product_name}</h4>

      {/* Các thuộc tính (ví dụ màu sắc, kích thước) */}
      <div className="text-sm text-gray-600 mb-2">
        {item.attributes.map((attr) => (
          <span key={attr.key} className="mr-2">
            {attr.key}: {attr.value}
          </span>
        ))}
      </div>

      {/* Hệ thống đánh giá */}
      <div className="rating mb-2 flex items-center gap-0.5">
        <span className="text-sm">Rating:</span>
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`cursor-pointer ${
              index < rating ? "text-yellow-500" : "text-gray-300"
            }`}
            onClick={() => handleRatingClick(index)}
          >
            <FaStar />
          </span>
        ))}
      </div>

      {/* Trường nhận xét */}
      <div>
        <label className="block text-sm mb-2">Comment</label>
        <textarea
          className="w-full p-3 border rounded"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
          rows={4}
        />
      </div>
      {/* Submit & Cancel Buttons */}
      <div className="flex justify-end mt-4 gap-4">
        <button
          className="bg-gray-800 text-white px-10 py-2 rounded font-semibold hover:bg-gray-500"
          onClick={handleComment}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ReviewItem;
