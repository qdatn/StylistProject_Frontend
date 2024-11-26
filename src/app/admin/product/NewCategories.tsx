// app/admin/product/ProductList.tsx
import CategoryForm from "@components/CategoryForm";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Category, mockCategories } from "@src/types/Category";
import axiosClient from "@api/axiosClient";

const baseUrl = import.meta.env.VITE_API_URL;

const NewCategory: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const navigate = useNavigate();
  const addCategoryToDB = async (category: Category) => {
    try {
      const addCategory = axiosClient.post<Category>(
        `${baseUrl}/api/category`,
       category
      );
    } catch (error) {
      alert(error);
    }
  };
  const handleAddCategory = (newCategory: Partial<Category>) => {
    const categoryToAdd: Category = { ...newCategory, id: newCategory._id } as Category;
    setCategories((prevCategory) => [...prevCategory, categoryToAdd]);
    addCategoryToDB(categoryToAdd);
    alert('Add successfully');
    navigate("/admin/product/categories"); // Chuyển hướng về danh sách sản phẩm
  };
  const handelCancel = () => {
    navigate("/admin/product/categories"); //
  };

  return (
    <div>
      <div className="font-semibold text-xl p-6">New Product</div>
      
      {/* Category Form */}
      <div className="w-full">
        <CategoryForm
        onSave={handleAddCategory}
        onCancel={handelCancel} 
        type="add"
        />
      </div>
    </div>
  );
};

export default NewCategory;
