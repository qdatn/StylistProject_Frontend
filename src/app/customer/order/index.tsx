"use client";
// app/order/page.tsx
import React from 'react';
import Ordertracking from '@components/Ordertracking';
import mockOrders from '@src/types/Order';
const OrderPage = () => {
  return (
    <>
      <div className="order-page-container bg-white">
        <h1 className="text-xl font-semibold pt-6 pb-6 text-gray-700">Order form</h1>
        {mockOrders.map(order => (
          <Ordertracking key={order.order_id} order={order} />
        ))}
      </div>
    </>
  );
};

export default OrderPage;