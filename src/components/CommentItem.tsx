import React from "react";
import { FaStar } from "react-icons/fa";

interface Attribute {
  key: string;
  value: string[];
}

interface CommentItemProps {
  username: string;
  rating: number;
  review: string;
  attributes: Attribute[];
  created_date: string;
}

const CommentItem: React.FC<CommentItemProps> = ({
  username,
  rating,
  review,
  attributes,
  created_date,
}) => {
  return (
    <div className="border p-4 rounded-md shadow">
      <div className="flex flex-row gap-4">
        <h3 className="font-medium text-gray-800">{username}</h3>
        <div className="flex items-center ">
          {Array.from({ length: rating }, (_, i) => (
            <FaStar key={i} className="text-yellow-500" />
          ))}
        </div>
      </div>
      {/* <div className="text-gray-500 text-[14px] mb-2">
                {attributes.map(attr => (
                    <span key={attr.key} className="mr-2">
                        {attr.key}: {attr.value}
                    </span>
                ))}
            </div> */}
      <p className="text-gray-600 mb-2">{review}</p>
      <p className="text-xs text-gray-400">{created_date.toString()}</p>
    </div>
  );
};

export default CommentItem;
