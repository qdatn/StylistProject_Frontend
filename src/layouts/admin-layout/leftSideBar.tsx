// components/Sidebar.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [isProductOpen, setIsProductOpen] = useState(false);

  return (
    <div className="w-1/5 bg-white h-full shadow-lg flex flex-col">
      <div className="p-6">
        <Link to="/" className="text-2xl font-bold text-yellow-500">
          Style
        </Link>
      </div>
      <ul className="flex flex-col">
        <li className="py-3 px-4 text-gray-600 hover:bg-gray-200">
          <Link to="/admin">General</Link>
        </li>
        <li className="py-3 px-4 text-gray-600 hover:bg-gray-200">
          <Link to="/admin/order">Order</Link>
        </li>
        <li
          className="py-3 px-4 text-gray-600 hover:bg-gray-200 cursor-pointer"
          onClick={() => setIsProductOpen(!isProductOpen)}
        >
          <span>Product</span>
        </li>
        {isProductOpen && (
          <ul className="pl-6">
            <li className="py-2 px-4 text-gray-600 hover:bg-gray-200">
              <Link to="/admin/product/list">Product List</Link>
            </li>
            <li className="py-2 px-4 text-gray-600 hover:bg-gray-200">
              <Link to="/admin/product/categories">Categories</Link>
            </li>
            <li className="py-2 px-4 text-gray-600 hover:bg-gray-200">
              <Link to="/admin/product/pricelist">Price List</Link>
            </li>
          </ul>
        )}
        <li className="py-3 px-4 text-gray-600 hover:bg-gray-200">
          <Link to="/admin/storage">Storage</Link>
        </li>
        <li className="py-3 px-4 text-gray-600 hover:bg-gray-200">
          <Link to="/admin/customer">Customer</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
