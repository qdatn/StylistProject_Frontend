// app/admin/product/OrderCategories.tsx
import mockOrders, { Order, OrderList } from "@src/types/Order";
import React, { useEffect, useState } from "react";
import OrderTable from "./OrderTable";
import { PaginationType } from "@src/types/Pagination";
import axiosClient from "@api/axiosClient";
const urlPath = import.meta.env.VITE_API_URL;
const OrderManagement: React.FC = () => {
  //const [Orders, setOrders] = useState<Order[]>(mockOrders);

  // Lấy lại danh sách từ `mockOrders` mỗi khi component được render
  const [orders, setOrders] = useState<OrderList>({
    data: [],
    pagination: {},
  });
  const [pagination, setPagination] = useState<PaginationType>({
    currentPage: 1,
    pageSize: 8,
    totalItems: 0,
    totalPages: 0,
  });

  const fetchOrderItem = async (page: number, pageSize: number) => {
    try {
      const response = await axiosClient.getOne<OrderList>(
        `${urlPath}/api/order/`,
        //pagination params
        { page: page, limit: pageSize }
      );

      setOrders(response);

      setPagination(response.pagination);
      // setHasMore(page < response.pagination.totalPages!);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    fetchOrderItem(pagination.currentPage!, pagination.pageSize!);
  }, []);
  const refreshData = () => {
    // Fetch the updated data and set it to the state that controls `dataSource`
    fetchOrderItem(pagination.currentPage!, pagination.pageSize!); // Your existing function to fetch updated data
  };

  return (
    <div>
      <div className="font-semibold text-xl p-6">Order Page</div>
      <div>
        <OrderTable orders={orders} onDeleteSuccess={refreshData} />
      </div>
    </div>
  );
};

export default OrderManagement;