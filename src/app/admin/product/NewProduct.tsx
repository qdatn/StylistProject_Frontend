// app/admin/product/ProductList.tsx
import ProductForm from "@components/product/ProductForm";
import React, { useState } from "react";
import mockProducts, { Product } from "@src/types/Product";
import { useNavigate } from "react-router-dom";
import axiosClient from "@api/axiosClient";

const baseUrl = import.meta.env.VITE_API_URL;

const NewProduct: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const navigate = useNavigate();

  const addProductToDB = async (product: Product) => {
    try {
      const addProduct = axiosClient.post<Product>(
        `${baseUrl}/api/product`,
        product
      );
    } catch (error) {
      alert(error);
    }
  };
  const handleAddProduct = (newProduct: Partial<Product>) => {
    // Since we're working with Partial<Product>, we ensure it has an 'id' before pushing
    const productToAdd: Product = {
      ...newProduct,
      // id: newProduct._id || `prod-${Date.now()}`,
    } as Product;
    setProducts((prevProducts) => [...prevProducts, productToAdd]);
    addProductToDB(productToAdd);
    alert("Add successfully");
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
        <ProductForm onSave={handleAddProduct} onCancel={handelCancel} type="add"/>
      </div>
    </div>
  );
};

export default NewProduct;
