// app/admin/product/ProductCategories.tsx
import React, { useEffect, useState } from "react";
import { Product } from "@src/types/Product";
import mockProducts, { updateProductInMockProducts } from "@src/types/Product"; // Import hàm cập nhật sản phẩm
import StorageTable from "./StorageTable";
const StoragePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);

  // Hàm để cập nhật lại sản phẩm
  const handleStorageUpdate = (updatedProduct: Product) => {
    // Cập nhật sản phẩm trong mock data
    updateProductInMockProducts(updatedProduct);
    // Cập nhật lại danh sách sản phẩm trong state
    setProducts([...mockProducts]); // Cập nhật lại sản phẩm từ mockProducts
  };

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
          onStorageUpdate={handleStorageUpdate} // Truyền hàm cập nhật cho ProductTable
        />
      </div>
    </div>
  );
};

export default StoragePage;