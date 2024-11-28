import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommonTable from '@components/ui/table'; // Giả sử bạn đã có component CommonTable
import { message, Tag } from 'antd';
import { Discount, DiscountList } from '@src/types/Discount'; // Import type của Discount
import { ColumnsType } from 'antd/es/table';
import axiosClient from '@api/axiosClient';
import { PaginationType } from '@src/types/Pagination';

const baseUrl = import.meta.env.VITE_API_URL;

interface DiscountTableProps {
  discounts: DiscountList; // Prop chứa danh sách mã giảm giá
  onDeleteSuccess: () => void;
  onPageChange: (page: number, pageSize: number) => void;
  pagination:PaginationType;
}

const discountColumns: ColumnsType<Discount> = [
  // {
  //   title: 'ID',
  //   dataIndex: '_id',
  // },
  {
    title: 'Code',
    dataIndex: 'code',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    render: (type: string) => (
      <Tag color={type === 'product' ? 'blue' : 'green'}>{type.toUpperCase()}</Tag>
    ),
    filters: [
      { text: 'Product', value: 'product' },
      { text: 'Category', value: 'category' },
      { text: 'All', value: 'all' }
    ],
    onFilter: (value, record) => record.type === value,
  },
  {
    title: 'Value',
    dataIndex: 'value',
    render: (value: number) => `${value}%`,
  },
  {
    title: 'Start Date',
    dataIndex: 'start_date',
    render: (date: string) => new Date(date).toLocaleDateString(),
  },
  {
    title: 'End Date',
    dataIndex: 'end_date',
    render: (date: string) => new Date(date).toLocaleDateString(),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (status: boolean) => (
      <Tag color={status ? 'green' : 'red'}>
        {status ? 'Active' : 'Inactive'}</Tag>
    ),
    filters: [
      { text: 'Active', value: true },
      { text: 'Inactive', value: false },
    ],
    onFilter: (value, record) => record.status === value,
  },
];

const DiscountTable: React.FC<DiscountTableProps> = ({ discounts, onDeleteSuccess, onPageChange, pagination }) => {
  const navigate = useNavigate();

  const handleRowClick = (record: Discount) => {
    // Điều hướng đến trang chi tiết hoặc chỉnh sửa mã giảm giá
    navigate(`/admin/discount/edit/${record._id}`, {
      state: { discount: record },
    });
  };

  const handleAddNewDiscount = () => {
    // Điều hướng đến trang thêm mới mã giảm giá
    navigate('new');
  };
  const handleDeleteDiscounts = async (selectedKeys: React.Key[]) => {
    try {
      await Promise.all(
        selectedKeys.map((id) =>
          axiosClient.delete(`${baseUrl}/api/discount/${id}`)
        )
      );
      message.success("Discounts deleted successfully");
    } catch (error) {
      console.error(error);
      message.error("Failed to delete Discounts");
    }
  };
  return (
    <div>
      <CommonTable
        columns={discountColumns}
        dataSource={discounts.data}
        rowKey="_id"
        rowSelection={{
          type: 'checkbox',
        }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record), // Điều hướng khi nhấn vào dòng
        })}
        onAddNew={handleAddNewDiscount} // Hàm thêm mới mã giảm giá
        onDeleteSuccess={onDeleteSuccess}
        onDelete={handleDeleteDiscounts}
        pagination={discounts.pagination}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default DiscountTable;
