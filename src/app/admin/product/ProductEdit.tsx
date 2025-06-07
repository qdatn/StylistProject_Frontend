// app/admin/product/EditProduct.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ProductForm from "@components/new/ProductForm";
import { Product } from "@src/types/new/Product";
import axiosClient from "@api/axiosClient";
import { notification } from "antd";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const location = useLocation();
  const productFromState = location.state?.product || null;

  const [product, setProduct] = useState<Product | null>(productFromState);

  const updateProductInDB = async (
    updatedProduct: Product,
    filesToUpload: File[],
    imagesToDelete: string[]
  ) => {
    // try {
    //   const updateProduct = await axiosClient.put<Product>(
    //     `${baseUrl}/api/product/${id}`,
    //     updatedProduct
    //   );
    // } catch (error) {
    //   console.log(error);
    //   alert(error);
    // }
    // Step 0: Xóa ảnh cũ nếu có
    if (imagesToDelete.length > 0) {
      await Promise.all(
        imagesToDelete.map(async (imageUrl) => {
          await axiosClient.post(`${baseUrl}/api/product/delete-img/${id}`, {
            imageUrl,
          });
        })
      );
    }
    // Step 1: Upload new images if any
    let uploadedImageUrls: string[] = [];
    if (filesToUpload.length > 0) {
      const formData = new FormData();
      filesToUpload.forEach((file) => {
        formData.append("images", file);
      });

      const uploadResponse = await axios.post<{ imageUrls: string[] }>(
        `${baseUrl}/api/product/upload/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      uploadedImageUrls = uploadResponse.data.imageUrls;
    }

    // Step 2: Update product with new image URLs
    const updatedImages = [
      ...(updatedProduct.images || []),
      ...uploadedImageUrls,
    ];

    await axiosClient.put<Product>(`${baseUrl}/api/product/${id}`, {
      ...updatedProduct,
      images: updatedImages,
    });
  };

  const handleUpdateProduct = async (
    updatedProduct: Partial<Product>,
    filesToUpload: File[],
    imagesToDelete: string[] 
  ) => {
    if (product) {
      // Đảm bảo rằng _id luôn có giá trị và không bị mất khi cập nhật
      const updatedProductWithId: Product = {
        ...product,
        ...updatedProduct,
        _id: product._id, // Đảm bảo rằng _id không bị mất
      };

      // // Cập nhật danh mục trong mockCategories (nếu cần)
      // const index = mockProducts.findIndex((cat) => cat._id === product._id);
      // if (index !== -1) {
      //   mockProducts[index] = { ...mockProducts[index], ...updatedProduct };
      // }

      // Cập nhật lại danh mục trong state
      setProduct(updatedProductWithId);

      // updateProductInDB(updatedProductWithId);
      await updateProductInDB(updatedProductWithId, filesToUpload, imagesToDelete);

      // Thông báo thành công
      console.log("Updated Product:", updatedProductWithId);
      notification.success({
        message: "Product updated successfully!",
        description: "",
        placement: "topRight",
        duration: 2,
      });
      navigate("/admin/product/list"); // Chuyển hướng về danh sách sản phẩm
    }
  };
  const handelCancel = () => {
    navigate("/admin/product/list");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* <h1 className="font-semibold text-xl p-6">Edit Product</h1> */}
      {product ? (
        <ProductForm
          initialProduct={product}
          onSave={handleUpdateProduct}
          onCancel={handelCancel}
          type="update"
        />
      ) : (
        <p>Đang tải dữ liệu sản phẩm...</p>
      )}
    </div>
  );
};

export default EditProduct;
