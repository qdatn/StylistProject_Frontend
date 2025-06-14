// components/Ordertracking.tsx
import React, { useState } from "react";
import OrderItemPage from "@components/OrderItem";
import { Order } from "@src/types/Order";
import { OrderItem } from "@src/types/OrderItem";
import { formatCurrency } from "@utils/format";

interface OrdertrackingProps {
  order: Order;
  orderitems: OrderItem[];
}

const Ordertracking: React.FC<OrdertrackingProps> = ({ order, orderitems }) => {


  console.log("ODDEDASD", order);
  console.log("ODDEDASD ITEM", orderitems);
  return (
    <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-5xl mx-auto">
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

      {/* Tổng tiền */}
      <div className="order-total flex justify-end pt-4 border-t">
        <div className="text-right">
          {order.discount && order.discount > 0 && (
            <p className="mb-1">
              <span className="font-medium">Discount:</span>{" "}
              -{formatCurrency(order.discount)}
            </p>
          )}
          <p className="text-lg font-bold mt-2">
            Total: {formatCurrency(order.total_price)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Ordertracking;
