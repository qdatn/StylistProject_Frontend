import React, { useState, useEffect } from "react";
import ProductTable from "./ProductTable";
import { Product } from "@src/types/Product";
import mockProducts, { updateProductInMockProducts } from "@src/types/Product"; // Import hàm cập nhật sản phẩm

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);

  // Hàm để cập nhật lại sản phẩm
  const handleProductUpdate = (updatedProduct: Product) => {
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
      <div className="font-semibold text-xl p-6">Product List</div>
      <div>
        <ProductTable
          products={products}
          onProductUpdate={handleProductUpdate} // Truyền hàm cập nhật cho ProductTable
        />
      </div>
    </div>
  );
};

export default ProductList;
