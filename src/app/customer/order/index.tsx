"use client";
// app/order/page.tsx
import React, { useEffect, useState } from "react";
import Ordertracking from "@components/Ordertracking";
import { Order, OrderList } from "@src/types/Order";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import axiosClient from "@api/axiosClient";
import { PaginationType } from "@src/types/Pagination";

const baseUrl = import.meta.env.VITE_API_URL;
const OrderPage = () => {
  const user = useSelector((state: RootState) => state.persist.auth.user);

  const [orders, setOrders] = useState<OrderList>({ data: [], pagination: {} });
  const [pagination, setPagination] = useState<PaginationType>({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  const fetchOrderList = async (page: number, pageSize: number) => {
    try {
      const ordersList = await axiosClient.getOne<OrderList>(
        `${baseUrl}/api/order/user/${user?.user._id}`,
        { params: { page, limit: pageSize } }
      );
      console.log("ORDERLL", ordersList);

      setOrders(ordersList);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    fetchOrderList(pagination.currentPage! ?? 1, pagination.pageSize!);
  }, []);

  useEffect(() => {
    console.log("Updated orders:", orders);
    console.log("PAGINATION:", pagination);
  }, [orders, pagination]); // Log orders when it updates

  return (
    <>
      <div className="order-page-container bg-white">
        <h1 className="text-xl font-semibold pt-6 pb-6 text-gray-700">
          Order form
        </h1>
        {/* {mockOrders.map((order) => (
          <Ordertracking key={order._id} order={order} />
        ))} */}
        {orders.data &&
          orders.data.map((order) => (
            <Ordertracking
              key={order.order._id}
              order={order.order}
              orderitems={order.order_items}
            />
          ))}
      </div>
    </>
  );
};

export default OrderPage;
