// app/admin/product/EditProduct.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ProductForm from "@components/product/ProductForm";
import mockProducts, { Product } from "@src/types/Product";
import axiosClient from "@api/axiosClient";

const baseUrl = import.meta.env.VITE_API_URL;

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Lấy ID sản phẩm từ URL
  const navigate = useNavigate();

  // Lấy product từ state nếu có, nếu không thì có thể fetch từ server
  const location = useLocation();
  const productFromState = location.state?.product || null;

  const [product, setProduct] = useState<Product | null>(productFromState);

  // useEffect(() => {
  //   // Tìm sản phẩm theo ID trong mockProducts
  //   console.log(product)
  //   const existingProduct = mockProducts.find((prod) => prod._id === id);
  //   if (existingProduct) {
  //     setProduct(existingProduct);
  //   } else {
  //     alert("Không tìm thấy sản phẩm.");
  //     navigate("/admin/product/list"); // Quay lại danh sách nếu không tìm thấy sản phẩm
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
      const index = mockProducts.findIndex((cat) => cat._id === product._id);
      if (index !== -1) {
        mockProducts[index] = { ...mockProducts[index], ...updatedProduct };
      }

      // Cập nhật lại danh mục trong state
      setProduct(updatedProductWithId);

      updateProductInDB(updatedProductWithId);

      // Thông báo thành công
      console.log("Updated Product:", updatedProductWithId);
      alert("Product updated successfully!");
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
          type="edit"
        />
      ) : (
        <p>Đang tải dữ liệu sản phẩm...</p>
      )}
    </div>
  );
};

export default EditProduct;
