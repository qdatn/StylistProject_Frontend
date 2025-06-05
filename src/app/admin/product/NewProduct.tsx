// app/admin/product/ProductList.tsx
import ProductForm from "@components/new/ProductForm";
import React, { useState } from "react";
import { Product } from "@src/types/new/Product";
import { useNavigate } from "react-router-dom";
import axiosClient from "@api/axiosClient";
import { notification } from "antd";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

const NewProduct: React.FC = () => {
  const navigate = useNavigate();

  // const addProductToDB = async (product: Product) => {
  //   try {
  //     const addProduct = axiosClient.post<Product>(
  //       `${baseUrl}/api/product`,
  //       product
  //     );
  //   } catch (error) {
  //     alert(error);
  //   }
  // };

  const addProductToDB = async (product: Product, filesToUpload: File[]) => {
    // Bước 1: Tạo sản phẩm không có ảnh
    const response = await axiosClient.post<Product>(
      `${baseUrl}/api/product`,
      { ...product, images: [] } // Gửi mảng ảnh rỗng
    );

    const createdProduct = response;
    const productId = createdProduct._id;

    if (!productId) {
      throw new Error("Failed to create product: missing ID");
    }

    // Bước 2: Upload ảnh nếu có
    let uploadedImageUrls: string[] = [];
    if (filesToUpload.length > 0) {
      const formData = new FormData();
      filesToUpload.forEach((file) => {
        formData.append("images", file);
      });

      const uploadResponse = await axios.post<{ imageUrls: string[] }>(
        `${baseUrl}/api/product/upload/${productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      uploadedImageUrls = uploadResponse.data.imageUrls;
    }

    // Bước 3: Cập nhật sản phẩm với danh sách ảnh
    await axiosClient.put(`${baseUrl}/api/product/${productId}`, {
      images: [...(product.images || []), ...uploadedImageUrls],
    });
  };
  const handleAddProduct = async (
    newProduct: Partial<Product>,
    filesToUpload: File[]
  ) => {
    // Since we're working with Partial<Product>, we ensure it has an 'id' before pushing
    const productToAdd: Product = {
      ...newProduct,
      // id: newProduct._id || `prod-${Date.now()}`,
    } as Product;
    await addProductToDB(productToAdd, filesToUpload);
    notification.success({
      message: "Product added successfully!",
      description: "",
      placement: "topRight",
      duration: 2,
    });
    navigate("/admin/product/list"); // Chuyển hướng về danh sách sản phẩm
  };
  const handelCancel = () => {
    navigate("/admin/product/list");
  };

  return (
    <div>
      {/* <div className="font-semibold text-xl p-6">New Product</div> */}
      {/* Product Form */}
      <div className="w-full">
        <ProductForm
          onSave={handleAddProduct}
          onCancel={handelCancel}
          type="add"
        />
      </div>
    </div>
  );
};

export default NewProduct;
