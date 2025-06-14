// app/admin/product/EditProduct.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Product } from "@src/types/new/Product";
import ProductStorageForm from "@components/ProductStorageForm";
import axiosClient from "@api/axiosClient";
import { notification } from "antd";

const baseUrl = import.meta.env.VITE_API_URL;
const EditProductStorage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Lấy ID sản phẩm từ URL
  const navigate = useNavigate();
  const location = useLocation();
  const productFromState = location.state?.product || null;

  const [product, setProduct] = useState<Product | null>(productFromState);

  // useEffect(() => {
  //   // Tìm sản phẩm theo ID trong mockProducts
  //   const existingProduct = mockProducts.find((prod) => prod._id === id);
  //   if (existingProduct) {
  //     setProduct(existingProduct);
  //   } else {
  //     alert("Không tìm thấy sản phẩm.");
  //     navigate("/admin/storage"); // Quay lại danh sách nếu không tìm thấy sản phẩm
  //   }
  // }, [id, navigate]);
  const updateProductInDB = async (updatedProduct: Product) => {
    try {
      const updateProduct = await axiosClient.put<Product>(
        `${baseUrl}/api/product/${id}`,
        updatedProduct
      );
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };
  const handleUpdateProduct = (updatedProduct: Partial<Product>) => {
    if (product) {
      // Đảm bảo rằng _id luôn có giá trị và không bị mất khi cập nhật
      const updatedProductWithId: Product = {
        ...product,
        ...updatedProduct,
        _id: product._id, // Đảm bảo rằng _id không bị mất
      };

      // Cập nhật danh mục trong mockCategories (nếu cần)
      // const index = mockProducts.findIndex((cat) => cat._id === product._id);
      // if (index !== -1) {
      //   mockProducts[index] = { ...mockProducts[index], ...updatedProduct };
      // }

      // Cập nhật lại danh mục trong state
      setProduct(updatedProductWithId);
      updateProductInDB(updatedProductWithId);

      // Thông báo thành công
      console.log("Updated Product:", updatedProductWithId);
      notification.success({
        message: "Product updated successfully!",
        description: "",
        placement: "topRight",
        duration: 2,
      });
      navigate("/admin/storage"); // Chuyển hướng về danh sách sản phẩm
    };
  }
  const handelCancel = () => {
    navigate("/admin/storage");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* <h1 className="font-semibold text-xl pl-6">Edit Product</h1> */}
      {product ? (
        <ProductStorageForm
          initialProduct={product}
          onSave={handleUpdateProduct}
          onCancel={handelCancel}
          type="edit"
        />
      ) : (
        <p>Đang tải dữ liệu sản phẩm...</p>
      )}
    </div>
  );
};

export default EditProductStorage;
