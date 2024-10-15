"use client";

import Transition from "@/components/Transition";
import { MainLayout } from "../layout";
// import Image from "next/image";
// import Link from "next/link";

export default function ProductList() {
  return (
    <MainLayout>
      <Transition>
        <div className="bg-white">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-6 text-center">
              Our Products
            </h1>

            {/* <!-- Product Grid --> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* <!-- Product Item --> */}
              <div className="bg-white p-4 rounded-lg">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Product 1"
                  className="w-full h-32 object-cover mb-4 rounded"
                />
                <h2 className="text-xl font-semibold mb-2">Product 1</h2>
                <p className="text-gray-600 mb-4">$29.99</p>
                <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 transition">
                  Add to Cart
                </button>
              </div>

              {/* <!-- Repeat the above block for more products --> */}
              <div className="bg-white p-4 rounded-lg">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Product 2"
                  className="w-full h-32 object-cover mb-4 rounded"
                />
                <h2 className="text-xl font-semibold mb-2">Product 2</h2>
                <p className="text-gray-600 mb-4">$39.99</p>
                <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 transition">
                  Add to Cart
                </button>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Product 1"
                  className="w-full h-32 object-cover mb-4 rounded"
                />
                <h2 className="text-xl font-semibold mb-2">Product 1</h2>
                <p className="text-gray-600 mb-4">$29.99</p>
                <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 transition">
                  Add to Cart
                </button>
              </div>

              {/* <!-- Repeat the above block for more products --> */}
              <div className="bg-white p-4 rounded-lg">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Product 2"
                  className="w-full h-32 object-cover mb-4 rounded"
                />
                <h2 className="text-xl font-semibold mb-2">Product 2</h2>
                <p className="text-gray-600 mb-4">$39.99</p>
                <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 transition">
                  Add to Cart
                </button>
              </div>
              {/* <!-- Add more product items as needed --> */}
            </div>
          </div>
        </div>
      </Transition>
    </MainLayout>
  );
}
