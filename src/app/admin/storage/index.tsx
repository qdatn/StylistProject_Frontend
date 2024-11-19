// app/admin/product/ProductCategories.tsx
import React, { useEffect, useState } from "react";
import { Product } from "@src/types/Product";
import mockProducts from "@src/types/Product"; // Import hàm cập nhật sản phẩm
import StorageTable from "./StorageTable";
const StoragePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);

  // Lấy lại danh sách từ `mockProducts` mỗi khi component được render
  useEffect(() => {
    setProducts([...mockProducts]);
  }, []);

  return (
    <div>
      <div className="font-semibold text-xl p-6"></div>
      <div>
        <StorageTable
          products={products}
        />
      </div>
    </div>
  );
};

export default StoragePage;