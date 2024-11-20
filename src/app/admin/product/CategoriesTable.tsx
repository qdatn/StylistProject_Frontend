import React from 'react';
import { useNavigate } from 'react-router-dom';
import CommonTable from '@components/ui/table'; // Giả sử bạn đã có component CommonTable
import { Tag } from 'antd';
import { Category, mockCategories } from '@src/types/Category'; // Import mock data của category
interface CategoryTableProps {
  categories: Category[]; // Prop chứa danh sách danh mục
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

}) => {
  const navigate = useNavigate();

  const handleRowClick = (record: Category) => {
    // Điều hướng đến trang chỉnh sửa danh mục với ID
    navigate(`/admin/product/categories/edit/${record._id}`);
  };

  const handleAddNewCategory = () => {
    // Điều hướng đến trang thêm mới danh mục
    navigate('new');
  };
  return (
    <div>
      <CommonTable
        columns={categoryColumns}
        dataSource={categories}
        rowKey="_id"
        rowSelection={{
          type: 'checkbox',
        }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record), // Điều hướng khi nhấn vào dòng
        })}
        onAddNew={handleAddNewCategory} // Hàm thêm mới danh mục
        hideHideButton={true}
      />
    </div>
  );
};

export default CategoryTable;
