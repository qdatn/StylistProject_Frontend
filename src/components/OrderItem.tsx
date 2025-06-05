// components/OrderItem.tsx
import React from "react";
import { OrderItem as OrderItemType } from "@src/types/OrderItem";
import { Link, useNavigate } from "react-router-dom";
import { formatCurrency } from "@utils/format";

interface OrderItemProps {
  item: OrderItemType;
}

const OrderItem: React.FC<OrderItemProps> = ({ item }) => {
  const { product, quantity, attributes } = item;
  console.log("ITEM", item);
  console.log(attributes);
  const navigate = useNavigate();
  return (
    <div className="flex items-center border-b py-4 text-gray-700">
      {/* Hình ảnh sản phẩm */}
      <Link to={`/product/${product._id}`}>
        <img
          src={product.images ? product.images?.[0] : "../src/public/assets/images/body-shape-banner.jpg"} // Sử dụng ảnh đầu tiên trong mảng image
          alt={product.product_name}
          className="w-20 h-24 object-cover mr-4"
        />
      </Link>

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
        {/* <p className="text-sm line-through text-gray-500 mb-1">
          {formatCurrency(product.price)}
        </p> */}
        <p className="text-sm text-red-500 font-semibold">
          {formatCurrency(product.price)}
        </p>
      </div>
    </div>
  );
};

export default OrderItem;
