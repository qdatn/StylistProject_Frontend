"use client";
// app/order/page.tsx
import React, { useEffect, useState } from "react";
import Ordertracking from "@components/Ordertracking";
import { Order, OrderList } from "@src/types/Order";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import axiosClient from "@api/axiosClient";
import { PaginationType } from "@src/types/Pagination";
import { motion } from "framer-motion";

const tabs = [
  { key: "all", label: "All" },
  { key: "Waiting for payment!", label: "Waiting for payment!" },
  { key: "in progress", label: "In Progress" },
  { key: "delivering", label: "Delivering" },
  { key: "shipped", label: "Shipped" },
  { key: "cancelled", label: "Cancelled" },
  { key: "pending", label: "Pending" },
  { key: "refunded", label: "Refunded" },
];

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
  const [selectedTab, setSelectedTab] = useState<string>("all");

  const fetchOrderList = async () => {
    try {
      const ordersList = await axiosClient.getOne<OrderList>(
        `${baseUrl}/api/order/user/${user?.user._id}/?limit=10000`
      );
      console.log("ORDERLL", ordersList);

      setOrders(ordersList);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    fetchOrderList();
  }, []);

  useEffect(() => {
    console.log("Updated orders:", orders);
    console.log("PAGINATION:", pagination);
  }, [orders, pagination]); // Log orders when it updates

  const filteredOrders =
    selectedTab === "all"
      ? orders.data
      : orders.data.filter((o) => o.order.status === selectedTab);

  return (
    <>
      <div className="order-page-container bg-white">
        <h1 className="text-xl font-semibold pt-6 pb-6 text-gray-700">
          Order History
        </h1>

        {/* Tabs */}
        <motion.div
          className="flex gap-2 flex-wrap mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 border
        ${
          selectedTab === tab.key
            ? "bg-black text-white shadow-md border-black"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200"
        }
      `}
              onClick={() => setSelectedTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>
        {/* {mockOrders.map((order) => (
          <Ordertracking key={order._id} order={order} />
        ))} */}
        {/* {orders.data && orders.data.length > 0 ? (
          orders.data.map((order) => ( */}
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <Ordertracking
              key={order.order._id}
              order={order.order}
              orderitems={order.order_items}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
              alt="No orders"
              className="w-40 h-40 object-contain mb-6"
            />
            <h2 className="text-lg font-medium">
              You don't have any {selectedTab == "All" ? "" : selectedTab}{" "}
              orders.
            </h2>
            <p className="text-sm mt-2">
              Shopping now and experience more products.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default OrderPage;
