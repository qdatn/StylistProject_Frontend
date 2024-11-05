// components/OrderItem.tsx
import React from 'react';
import { OrderItem as OrderItemType } from '@models/OrderItem';

interface OrderItemProps {
  item: OrderItemType;
}

const OrderItem: React.FC<OrderItemProps> = ({ item }) => {
  return (
    <div className="order-item flex items-center py-2 border-b text-gray-700">
      <img src={item.imageUrl} alt={item.product_name} className="w-16 h-16 mr-4" />
      <div className="flex-grow">
        <h2 className="font-semibold">{item.product_name}</h2>
        <p className="text-sm">Phân loại: {item.attributes.map(attr => `${attr.key}: ${attr.value}`).join(', ')}</p>
        <p className="text-sm line-through text-gray-500">£{item.purchased_price.toFixed(2)}</p>
        <p className="text-sm text-red-500">£{item.discounted_price.toFixed(2)}</p>
        <p className="text-sm">Số lượng: {item.orderitem_quantity}</p>
      </div>
      <button className="bg-gray-200 px-4 py-2 rounded mr-2">Review</button>
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Detail</button>
    </div>
  );
};

export default OrderItem;
