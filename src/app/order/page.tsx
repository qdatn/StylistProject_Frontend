"use client";
// app/order/page.tsx
import React, { use } from 'react';
import Ordertracking from '@/components/Ordertracking';
import mockOrders from '@/models/Order';

const OrderPage = () => {
  return (
    <div className="order-page-container">
      <h1 className="text-2xl font-bold mb-4">Order form</h1>
      {mockOrders.map(order => (
        <Ordertracking key={order.order_id} order={order} />
      ))}
    </div>
  );
};

export default OrderPage;