"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ProductItem from "@/components/productItem"; // Nhập component ProductItem

// Định nghĩa kiểu cho sản phẩm
interface Product {
  id: number; // Thêm ID vào kiểu sản phẩm
  name: string;
  originalPrice: string;
  discountedPrice: string;
  image: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]); // Khai báo mảng sản phẩm

  // Tạo dữ liệu giả cho sản phẩm
  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Wrap bodice balloon sleeve maxi dress',
      originalPrice: '£46.00',
      discountedPrice: '£36.00',
      image: 'https://via.placeholder.com/300x400', // Hình ảnh giả
    },
    {
      id: 2,
      name: 'Floral print sundress',
      originalPrice: '£29.00',
      discountedPrice: '£22.00',
      image: 'https://via.placeholder.com/300x400',
    },
    {
      id: 3,
      name: 'Classic denim jacket',
      originalPrice: '£60.00',
      discountedPrice: '£45.00',
      image: 'https://via.placeholder.com/300x400',
    },
    {
      id: 4,
      name: 'Classic denim jacket',
      originalPrice: '£60.00',
      discountedPrice: '£45.00',
      image: 'https://via.placeholder.com/300x400',
    },
    {
      id: 5,
      name: 'Classic denim jacket',
      originalPrice: '£60.00',
      discountedPrice: '£45.00',
      image: 'https://via.placeholder.com/300x400',
    },
  ];

  // Hàm lấy sản phẩm
  useEffect(() => {
    // Thay thế dữ liệu thật bằng dữ liệu giả
    setProducts(mockProducts); // Thiết lập sản phẩm với dữ liệu giả
  }, []);

  return (
    <div className="grid grid-rows-[auto_1fr_auto] bg-white items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* Hiển thị danh sách sản phẩm */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} /> // Truyền sản phẩm vào ProductItem
        ))}
      </div>
    </div>
    
  );
  
}
// import { useAuth0 } from "@auth0/auth0-react";
// const { loginWithRedirect, logout, user, isAuthenticated, isLoading } =
//   useAuth0();

// export default function App() {
//   if (isLoading) {
//     return <div>Loading...</div>;
//   }
//   return <div></div>;
// }
