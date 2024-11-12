// components/ui/ProductTable.tsx

import React, { useState } from 'react';
import { Table, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface Product {
  key: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  actions?: React.ReactNode;
}

const dataSource: Product[] = [
  {
    key: '1',
    name: 'Product 1',
    price: 100,
    stock: 50,
    category: 'Category A',
  },
  {
    key: '2',
    name: 'Product 2',
    price: 150,
    stock: 20,
    category: 'Category B',
  },
  // Thêm sản phẩm mẫu khác hoặc fetch từ backend
];

const ProductTable: React.FC = () => {
  const columns: ColumnsType<Product> = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price} VND`,
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => editProduct(record.key)}>Sửa</Button>
          <Button danger onClick={() => deleteProduct(record.key)}>Xóa</Button>
        </Space>
      ),
    },
  ];

  const editProduct = (key: string) => {
    console.log(`Chỉnh sửa sản phẩm với key: ${key}`);
    // Xử lý logic chỉnh sửa sản phẩm
  };

  const deleteProduct = (key: string) => {
    console.log(`Xóa sản phẩm với key: ${key}`);
    // Xử lý logic xóa sản phẩm
  };

  return <Table dataSource={dataSource} columns={columns} />;
};

export default ProductTable;
