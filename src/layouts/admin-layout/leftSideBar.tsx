// components/Sidebar.tsx
import React from 'react';

const Sidebar = () => {
  return (
    <div className="w-1/5 bg-white h-full shadow-lg flex flex-col">
      <div className="p-6">
            <a
              href="/"
              className="text-2xl font-bold text-yellow-500"
            >
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
          <a href="#">Dilivery</a>
        </li>
        <li className="py-3 px-4 text-gray-600 hover:bg-gray-200">
          <a href="#">Product</a>
        </li>
        <li className="py-3 px-4 text-gray-600 hover:bg-gray-200">
          <a href="#">Storage</a>
        </li>
        <li className="py-3 px-4 text-gray-600 hover:bg-gray-200">
          <a href="#">Customer</a>
        </li>
        {/* Thêm các mục khác theo nhu cầu */}
      </ul>
    </div>
  );
};

export default Sidebar;
