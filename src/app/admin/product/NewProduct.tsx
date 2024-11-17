// app/admin/product/ProductList.tsx
import ProductForm from "@components/ProductForm";
import React, { useState } from "react";
import mockProducts, { Product } from "@src/types/Product";

const NewProduct: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);

  const handleAddProduct = (newProduct: Partial<Product>) => {
    // Since we're working with Partial<Product>, we ensure it has an 'id' before pushing
    const productToAdd: Product = { ...newProduct, id: newProduct._id || `prod-${Date.now()}` } as Product;
    setProducts((prevProducts) => [...prevProducts, productToAdd]);
    alert('Sản phẩm đã được thêm thành công');
  };

  return (
    <div>
      <div className="font-semibold text-xl p-6">New Product</div>
      
      {/* Product Form */}
      <div className="w-full">
        <ProductForm onSave={handleAddProduct} />
      </div>

  
    </div>
  );
};

export default NewProduct;
