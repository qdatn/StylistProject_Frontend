import React from 'react';
import CommonTable from '@components/ui/table'; // Assuming correct path for CommonTable
import { Tag } from 'antd';
import dayjs from 'dayjs';
import { ColumnsType } from 'antd/es/table'; // Import the correct type for columns
import { Key } from 'antd/es/table/interface'; // Correct import for Key
import mockProducts from '@src/types/Product';
import { Product } from '@src/types/Product';

// Define columns for the product table
const productColumns: ColumnsType<Product> = [
  {
    title: 'Image',
    dataIndex: 'image',
    render: (image: string) => <img src={image} alt="product" style={{ width: 50, height: 50 }} />,
  },
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Quantity',
    dataIndex: 'stock_quantity',
  },
  {
    title: 'Original Price',
    dataIndex: 'originalPrice',
    render: (price: number) => `${price.toFixed(2)}£`,
  },
  {
    title: 'Discounted Price',
    dataIndex: 'discountedPrice',
    render: (price: number) => `${price.toFixed(2)}£`,
  },
  {
    title: 'Date Created',
    dataIndex: 'create_date',
    render: (create_date: string) => dayjs(create_date).format('DD/MM/YYYY'),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (status: boolean) => (
      <Tag color={status ? 'green' : 'volcano'}>
        {status ? 'Available' : 'Out of stock'}
      </Tag>
    ),
    filters: [
      { text: 'Available', value: true },
      { text: 'Unavailable', value: false },
    ],
    onFilter: (value: boolean | Key, record: Product) => record.status === value,
  },
];

const ProductTable: React.FC = () => {
  // Assuming 'mockProducts' is the correct path for your product data
  

  return (
    <CommonTable
      columns={productColumns}
      dataSource={mockProducts} // Pass mock product data
      rowKey="id"
      rowSelection={{
        type: 'checkbox',
      }}
    />
  );
};

export default ProductTable;
