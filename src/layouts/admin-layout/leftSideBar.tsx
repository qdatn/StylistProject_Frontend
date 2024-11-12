// components/Sidebar.tsx
import React, { useState } from 'react';

const Sidebar = () => {
  const [isProductOpen, setIsProductOpen] = useState(false);

  return (
    <div className="w-1/5 bg-white h-full shadow-lg flex flex-col">
      <div className="p-6">
        <a href="/" className="text-2xl font-bold text-yellow-500">
          Style
        </a>
      </div>
      <ul className="flex flex-col">
        <li className="py-3 px-4 text-gray-600 hover:bg-gray-200">
          <a href="#">General</a>
        </li>
        <li className="py-3 px-4 text-gray-600 hover:bg-gray-200">
          <a href="#">Order</a>
        </li>
        <li className="py-3 px-4 text-gray-600 hover:bg-gray-200">
          <a href="#">Delivery</a>
        </li>
        <li className="py-3 px-4 text-gray-600 hover:bg-gray-200 cursor-pointer" onClick={() => setIsProductOpen(!isProductOpen)}>
          <span>Product</span>
        </li>
        {isProductOpen && (
          <ul className="pl-6">
            <li className="py-2 px-4 text-gray-600 hover:bg-gray-200">
              <a href="#">Product List</a>
            </li>
            <li className="py-2 px-4 text-gray-600 hover:bg-gray-200">
              <a href="#">Categories</a>
            </li>
            <li className="py-2 px-4 text-gray-600 hover:bg-gray-200">
              <a href="#">Price List</a>
            </li>
          </ul>
        )}
        <li className="py-3 px-4 text-gray-600 hover:bg-gray-200">
          <a href="#">Storage</a>
        </li>
        <li className="py-3 px-4 text-gray-600 hover:bg-gray-200">
          <a href="#">Customer</a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
