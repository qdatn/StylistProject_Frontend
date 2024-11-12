import Transition from "@components/Transition";
// import Image from "next/image";
// import Link from "next/link";
import React, { useEffect, useState } from "react";
import ProductItem from "@components/productItem"; // Nhập component ProductItem
import mockProducts from "@src/types/Product";
import { Product } from "@src/types/Product";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]); // Khai báo mảng sản phẩm

  // Hàm lấy sản phẩm
  useEffect(() => {
    // Thay thế dữ liệu thật bằng dữ liệu giả
    setProducts(mockProducts); // Thiết lập sản phẩm với dữ liệu giả
  }, []);

  return (
    <>
      <div className="grid grid-rows-[auto_1fr_auto] bg-white items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        {/* Hiển thị danh sách sản phẩm */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
          {products.map((product) => (
            <ProductItem key={product.id} product={product} /> // Truyền sản phẩm vào ProductItem
          ))}
        </div>
      </div>
    </>
  );
}
