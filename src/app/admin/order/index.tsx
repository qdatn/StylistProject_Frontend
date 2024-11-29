// app/admin/product/OrderCategories.tsx
import mockOrders, { Order, OrderList, OrderListAdmin } from "@src/types/Order";
import React, { useEffect, useState } from "react";
import OrderTable from "./OrderTable";
import { PaginationType } from "@src/types/Pagination";
import axiosClient from "@api/axiosClient";
const urlPath = import.meta.env.VITE_API_URL;
const OrderManagement: React.FC = () => {
  //const [Orders, setOrders] = useState<Order[]>(mockOrders);

  // Lấy lại danh sách từ `mockOrders` mỗi khi component được render
  const [orders, setOrders] = useState<OrderListAdmin>({
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
      const response = await axiosClient.getOne<OrderListAdmin>(
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

  const pageSize = 8

  useEffect(() => {
    fetchOrderItem(pagination.currentPage!, pagination.pageSize!);
  }, []);

  const refreshData = () => {
    // Fetch the updated data and set it to the state that controls `dataSource`
    fetchOrderItem(pagination.currentPage!, pageSize!); // Your existing function to fetch updated data
  };

  const handlePageChange = (page: number) => {
    if (page <= pagination?.totalPages!) {
      setPagination({
        ...pagination,
        currentPage: page,
      });
    }
    //setPagination((prev) => ({ ...prev, currentPage: page, pageSize }));
    fetchOrderItem(page, pageSize);
  };

  return (
    <div>
      <div className="font-semibold text-xl p-6">Order Page</div>
      <div>
        <OrderTable
          orders={orders}
          onDeleteSuccess={refreshData}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default OrderManagement;