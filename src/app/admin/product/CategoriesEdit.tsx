import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import CategoryForm from "@components/CategoryForm";
import { Category, mockCategories } from "@src/types/Category";
import axiosClient from "@api/axiosClient";
import { notification } from "antd";

const baseUrl = import.meta.env.VITE_API_URL;
const EditCategory: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Lấy ID danh mục từ URL
  const navigate = useNavigate();
  const location = useLocation();
  const categoryFromState = location.state?.category || null;

  const [category, setCategory] = useState<Category | null>(categoryFromState);

  // useEffect(() => {
  //   // Tìm danh mục theo ID trong mockCategories
  //   const existingCategory = mockCategories.find((cat) => cat._id === id);
  //   if (existingCategory) {
  //     setCategory(existingCategory);
  //   } else {
  //     alert("Category not found.");
  //     navigate("/admin/product/categories"); // Quay lại danh sách nếu không tìm thấy danh mục
  //   }
  // }, [id, navigate]);

  const updateCategoryInDB = async (updatedCategory: Category) => {
    try {
      const updateCategory = await axiosClient.put<Category>(
        `${baseUrl}/api/category/${id}`,
        updatedCategory
      );
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };
  const handleUpdateCategory = (updatedCategory: Partial<Category>) => {
    if (category) {
      // Đảm bảo rằng _id luôn có giá trị và không bị mất khi cập nhật
      const updatedCategoryWithId: Category = {
        ...category,
        ...updatedCategory,
        _id: category._id, // Đảm bảo rằng _id không bị mất
      };

      // Cập nhật danh mục trong mockCategories (nếu cần)
      const index = mockCategories.findIndex((cat) => cat._id === category._id);
      if (index !== -1) {
        mockCategories[index] = { ...mockCategories[index], ...updatedCategory };
      }

      // Cập nhật lại danh mục trong state
      setCategory(updatedCategoryWithId);
      updateCategoryInDB(updatedCategoryWithId);
      // Thông báo thành công
      console.log("Updated Category:", updatedCategoryWithId);
      notification.success({
        message: "Category updated successfully!",
        description: "",
        placement: "topRight",
        duration: 2,
      });

      // Chuyển hướng về trang danh sách danh mục
      navigate("/admin/product/categories");
    }
  };

  const handleCancel = () => {
    navigate("/admin/product/categories"); // Quay lại danh sách danh mục
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Edit Category</h1>
      {category ? (
        <CategoryForm
          initialCategory={category}
          onSave={handleUpdateCategory}
          onCancel={handleCancel}
          type="edit"
        />
      ) : (
        <p>Loading category...</p>
      )}
    </div>
  );
};

export default EditCategory;
