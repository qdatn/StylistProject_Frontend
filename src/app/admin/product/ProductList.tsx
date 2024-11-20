import React, { useState, useEffect } from "react";
import ProductTable from "./ProductTable";
import { Product } from "@src/types/Product";
import mockProducts from "@src/types/Product"; // Import hàm cập nhật sản phẩm

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);

  // Lấy lại danh sách từ `mockProducts` mỗi khi component được render
  useEffect(() => {
    setProducts([...mockProducts]);
  }, []);

  return (
    <div>
      <div className="font-semibold text-xl p-6">Product List</div>
      <div>
        <ProductTable
          products={products}
        />
      </div>
    </div>
  );
};

export default ProductList;
