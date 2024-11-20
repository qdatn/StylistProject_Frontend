// app/admin/product/ProductCategories.tsx
import mockOrders, { Order } from "@src/types/Order";
import React, { useEffect, useState } from "react";
import OrderTable from "./OrderTable";

const OrderManagement: React.FC = () => {
  const [Orders, setOrders] = useState<Order[]>(mockOrders);

  // Lấy lại danh sách từ `mockOrders` mỗi khi component được render
  useEffect(() => {
    setOrders([...mockOrders]);
  }, []);

  return (
    <div>
      <div className="font-semibold text-xl p-6">Order Page</div>
      <div>
        <OrderTable
          orders={Orders}
        />
      </div>
    </div>
  );
};

export default OrderManagement;