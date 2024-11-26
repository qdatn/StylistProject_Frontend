import React from 'react';
import { useNavigate } from 'react-router-dom';
import CommonTable from '@components/ui/table'; // Giả sử bạn đã có component CommonTable
import { message, Tag } from 'antd';
import { Category, CategoryList, mockCategories } from '@src/types/Category'; // Import mock data của category
import axiosClient from '@api/axiosClient';

const baseUrl = import.meta.env.VITE_API_URL;

interface CategoryTableProps {
  categories: CategoryList; // Prop chứa danh sách danh mục
  onDeleteSuccess: () => void;
}
const categoryColumns = [
  {
    title: 'ID',
    dataIndex: '_id',
  },
  {
    title: 'Category Name',
    dataIndex: 'category_name',
  },
  {
    title: 'Description',
    dataIndex: 'description',
  },

];

const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  onDeleteSuccess,
}) => {
  const navigate = useNavigate();

  const handleRowClick = (record: Category) => {
    // Điều hướng đến trang chỉnh sửa danh mục với ID
    navigate(`/admin/product/categories/edit/${record._id}`,
      {state: {category: record}}
    );
  };

  const handleAddNewCategory = () => {
    // Điều hướng đến trang thêm mới danh mục
    navigate('new');
  };
  const handleDeleteCategories = async (selectedKeys: React.Key[]) => {
    try {
      await Promise.all(
        selectedKeys.map((id) =>
          axiosClient.delete(`${baseUrl}/api/category/${id}`)
        )
      );
      message.success("Categories deleted successfully");
    } catch (error) {
      console.error(error);
      message.error("Failed to delete Categories");
    }
  };
  return (
    <div>
      <CommonTable
        columns={categoryColumns}
        dataSource={categories.data}
        rowKey="_id"
        rowSelection={{
          type: 'checkbox',
        }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record), // Điều hướng khi nhấn vào dòng
        })}
        onAddNew={handleAddNewCategory} // Hàm thêm mới danh mục
        hideHideButton={true}
        pagination={categories.pagination}
        onDeleteSuccess={onDeleteSuccess}
        onDelete={handleDeleteCategories}
      />
    </div>
  );
};

export default CategoryTable;
