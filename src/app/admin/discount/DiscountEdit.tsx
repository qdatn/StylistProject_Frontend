// app/admin/discount/EditDiscount.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DiscountForm from "@components/DiscountForm"; // Form chỉnh sửa discount
import mockDiscounts, { Discount } from "@src/types/Discount"; // Dữ liệu giả lập discounts
import mockProducts, { Product, ProductList } from "@src/types/Product";
import { Category, CategoryList, mockCategories } from "@src/types/Category";
import axiosClient from "@api/axiosClient";
import { notification } from "antd";

const baseUrl = import.meta.env.VITE_API_URL;

const EditDiscount: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Lấy ID discount từ URL
  const navigate = useNavigate();
  const location = useLocation();
  const discountFromState = location.state?.discount || null;
  const [discount, setDiscount] = useState<Discount | null>(discountFromState);
  const [products, setProducts] = useState<Product[]>([]); // State lưu danh sách sản phẩm
  const [categories, setCategories] = useState<Category[]>([]); // State lưu danh sách danh mục
  // Gọi API để lấy danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      const response = await axiosClient.getOne<ProductList>(
        `${baseUrl}/api/product`,
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Failed:", error);
    }
  };

  // Gọi API để lấy danh sách danh mục
  const fetchCategories = async () => {
    try {
      const response = await axiosClient.getOne<CategoryList>(
        `${baseUrl}/api/category`,
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Failed:", error);
    }
  };

  // Dùng useEffect để gọi API khi component được render
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);
  const updateDiscountInDB = async (updatedDiscount: Discount) => {
    try {
      const updateProduct = await axiosClient.put<Discount>(
        `${baseUrl}/api/discount/${id}`,
        updatedDiscount
      );
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };
  const handleUpdateDiscount = (updatedDiscount: Partial<Discount>) => {
    if (discount) {
      // Đảm bảo rằng _id luôn có giá trị và không bị mất khi cập nhật
      const updatedDiscountWithId: Discount = {
        ...discount,
        ...updatedDiscount,
        _id: discount._id, // Đảm bảo rằng _id không bị mất
      };

      // Cập nhật lại discount trong state
      updateDiscountInDB(updatedDiscountWithId);
      setDiscount(updatedDiscountWithId);

      // Thông báo thành công
      console.log("Updated Discount:", updatedDiscountWithId);
      notification.success({
        message: "Discount updated successfully!",
        description: "You have successfully logged in.",
        placement: "topRight",
        duration: 2,
      });

      navigate("/admin/discount"); // Chuyển hướng về danh sách discounts
    }
  };

  const handleCancel = () => {
    navigate("/admin/discount"); // Quay lại danh sách discount nếu hủy
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Edit Discount</h1>
      {discount ? (
        <DiscountForm
          initialDiscount={discount}
          onSave={handleUpdateDiscount}
          onCancel={handleCancel}
          products={products}
          categories={categories}
          type="edit"
        />
      ) : (
        <p>Đang tải dữ liệu discount...</p>
      )}
    </div>
  );
};

export default EditDiscount;
