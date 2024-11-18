// app/admin/product/ProductList.tsx
import ProductForm from "@components/ProductForm";
import React, { useState } from "react";
import mockProducts, { Product } from "@src/types/Product";
import { useNavigate } from "react-router-dom";

const NewProduct: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const navigate = useNavigate();

  const handleAddProduct = (newProduct: Partial<Product>) => {
    // Since we're working with Partial<Product>, we ensure it has an 'id' before pushing
    const productToAdd: Product = { ...newProduct, id: newProduct._id || `prod-${Date.now()}` } as Product;
    setProducts((prevProducts) => [...prevProducts, productToAdd]);
    alert('Sản phẩm đã được thêm thành công');
    navigate("/admin/product/list"); // Chuyển hướng về danh sách sản phẩm
  };
  const handelCancel = () => {
    navigate("/admin/product/list");
  };

  return (
    <div>
      <div className="font-semibold text-xl p-6">New Product</div>
      
      {/* Product Form */}
      <div className="w-full">
        <ProductForm 
        onSave={handleAddProduct}
        onCancel={handelCancel} />
      </div>

  
    </div>
  );
};

export default NewProduct;
