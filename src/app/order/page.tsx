"use client";
// app/order/page.tsx
import React from 'react';
import Ordertracking from '@components/Ordertracking';
import mockOrders from '@models/Order';
import Header from '@layouts/main-layout/header';
import Footer from '@layouts/main-layout/footer';
const OrderPage = () => {
  return (
    <>
    <Header/>
    <div className="order-page-container bg-white">
      <h1 className="text-xl font-semibold p-6 text-gray-700">Order form</h1>
      {mockOrders.map(order => (
        <Ordertracking key={order.order_id} order={order} />
      ))}
    </div>
  <Footer/>
  </>
  );
};

export default OrderPage;