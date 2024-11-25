// app/admin/discount/EditDiscount.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DiscountForm from "@components/DiscountForm"; // Form chỉnh sửa discount
import mockDiscounts, { Discount } from "@src/types/Discount"; // Dữ liệu giả lập discounts
import mockProducts from "@src/types/Product";
import { mockCategories } from "@src/types/Category";
import axiosClient from "@api/axiosClient";

const baseUrl = import.meta.env.VITE_API_URL;

const EditDiscount: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Lấy ID discount từ URL
  const navigate = useNavigate();
  const location = useLocation();
  const discountFromState = location.state?.discount || null;
  const [discount, setDiscount] = useState<Discount | null>(discountFromState);

  // useEffect(() => {
  //   // Tìm discount theo ID trong mockDiscounts
  //   const existingDiscount = mockDiscounts.find((disc) => disc._id === id);
  //   if (existingDiscount) {
  //     setDiscount(existingDiscount);
  //   } else {
  //     alert("Không tìm thấy discount.");
  //     navigate("/admin/discount"); // Quay lại danh sách nếu không tìm thấy discount
  //   }
  // }, [id, navigate]);
  const updateDiscountInDB = async (updatedDiscount: Discount) => {
    try {
      const updateProduct = await axiosClient.put<Discount>(
        `${baseUrl}/api/product/${id}`,
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

      // Cập nhật discount trong mockDiscounts
      const index = mockDiscounts.findIndex((disc) => disc._id === discount._id);
      if (index !== -1) {
        mockDiscounts[index] = { ...mockDiscounts[index], ...updatedDiscount };
      }

      // Cập nhật lại discount trong state
      updateDiscountInDB(updatedDiscountWithId);
      setDiscount(updatedDiscountWithId);

      // Thông báo thành công
      console.log("Updated Discount:", updatedDiscountWithId);
      alert("Discount updated successfully!");
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
          mockProducts={mockProducts} // Truyền mockProducts
          mockCategories={mockCategories} // Truyền mockCategories
          type="edit"
        />
      ) : (
        <p>Đang tải dữ liệu discount...</p>
      )}
    </div>
  );
};

export default EditDiscount;
