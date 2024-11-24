// components/OrderItem.tsx
import React from "react";
import { OrderItem as OrderItemType } from "@src/types/OrderItem";

interface OrderItemProps {
  item: OrderItemType;
}

const OrderItem: React.FC<OrderItemProps> = ({ item }) => {
  const { product, quantity, attributes } = item;
  console.log("ITEM", item);
  console.log(attributes);
  return (
    <div className="flex items-center border-b py-4 text-gray-700">
      {/* Hình ảnh sản phẩm */}
      <img
        src={product.images ? product.images?.[0] : ""} // Sử dụng ảnh đầu tiên trong mảng image
        alt={product.product_name}
        className="w-20 h-24 object-cover mr-4"
      />

      {/* Thông tin sản phẩm */}
      <div className="flex-1">
        <h2 className="font-semibold text-lg mb-1 pb-2">
          {product.product_name}
        </h2>
        <p className="text-sm mb-1 pb-2">
          Phân loại:{" "}
          {attributes.map((attr) => `${attr.key}: ${attr.value}`).join(", ")}
        </p>
        <p className="text-sm mb-1">{quantity}x</p>
      </div>

      {/* Giá sản phẩm */}
      <div className="text-right">
        <p className="text-sm line-through text-gray-500 mb-1">
          £{product.price.toFixed(2)}
        </p>
        <p className="text-sm text-red-500 font-semibold">
          £{product.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default OrderItem;
