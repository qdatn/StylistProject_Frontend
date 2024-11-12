import React from 'react';
import CommonTable from '@components/ui/table'; // Giả sử bạn đã có component CommonTable
import { Tag } from 'antd';
import { mockCategories } from '@src/types/Category'; // Import mock data của category

const categoryColumns = [
  {
    title: 'Category Name',
    dataIndex: 'category_name',
  },
  {
    title: 'Description',
    dataIndex: 'description',
  },
  
];

const CategoryTable: React.FC = () => {
  return (
    <CommonTable
      columns={categoryColumns}
      dataSource={mockCategories}
      rowKey="category_id"
      rowSelection={{
        type: 'checkbox',
      }}
    />
  );
};

export default CategoryTable;
