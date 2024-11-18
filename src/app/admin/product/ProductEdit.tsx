// app/admin/product/EditProduct.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductForm from "@components/ProductForm";
import mockProducts, { Product, updateProductInMockProducts } from "@src/types/Product";

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Lấy ID sản phẩm từ URL
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Tìm sản phẩm theo ID trong mockProducts
    const existingProduct = mockProducts.find((prod) => prod._id === id);
    if (existingProduct) {
      setProduct(existingProduct);
    } else {
      alert("Không tìm thấy sản phẩm.");
      navigate("/admin/product/list"); // Quay lại danh sách nếu không tìm thấy sản phẩm
    }
  }, [id, navigate]);

  const handleUpdateProduct = (updatedProduct: Partial<Product>) => {
    if (product) {
      // Cập nhật sản phẩm trong mockProducts
      const updatedProducts = mockProducts.map((prod) =>
        prod._id === product._id ? { ...prod, ...updatedProduct } : prod
      );
      const updatedProductData = { ...product, ...updatedProduct };
      updateProductInMockProducts(updatedProductData); // Cập nhật mockProducts

      console.log("Updated Products:", updatedProduct); // Kiểm tra kết quả
      alert("Sản phẩm đã được cập nhật thành công.");
      navigate("/admin/product/list"); // Chuyển hướng về danh sách sản phẩm
    }
  };
  const handelCancel = () => {
    navigate("/admin/product/list");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      {product ? (
        <ProductForm
          initialProduct={product}
          onSave={handleUpdateProduct}
          onCancel={handelCancel}
        />
      ) : (
        <p>Đang tải dữ liệu sản phẩm...</p>
      )}
    </div>
  );
};

export default EditProduct;
