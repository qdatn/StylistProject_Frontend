import React from 'react';
import { useNavigate } from 'react-router-dom';
import CommonTable from '@components/ui/table'; // Giả sử bạn đã có component CommonTable
import { Tag } from 'antd';
import { Discount } from '@src/types/Discount'; // Import type của Discount
import { ColumnsType } from 'antd/es/table';

interface DiscountTableProps {
  discounts: Discount[]; // Prop chứa danh sách mã giảm giá
}

const discountColumns: ColumnsType<Discount> = [
  {
    title: 'ID',
    dataIndex: '_id',
  },
  {
    title: 'Code',
    dataIndex: 'code',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    render: (type: string) => (
      <Tag color={type === 'product' ? 'blue' :'green' }>{type.toUpperCase()}</Tag>
    ),
    filters: [
      { text: 'Product', value: 'product' },
      { text: 'Category', value: 'category' },
      {text:'All', value: 'all'}
    ],
    onFilter: (value, record) => record.type === value,
  },
  {
    title: 'Value',
    dataIndex: 'value',
    render: (value: number) => `${value}%`,
  },
  {
    title: 'Minimum Value',
    dataIndex: 'minimum_value',
    render: (value: number) => `${value.toFixed(2)}£`,
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

const DiscountTable: React.FC<DiscountTableProps> = ({ discounts }) => {
  const navigate = useNavigate();

  const handleRowClick = (record: Discount) => {
    // Điều hướng đến trang chi tiết hoặc chỉnh sửa mã giảm giá
    navigate(`/admin/discount/edit/${record._id}`);
  };

  const handleAddNewDiscount = () => {
    // Điều hướng đến trang thêm mới mã giảm giá
    navigate('new');
  };

  return (
    <div>
      <CommonTable
        columns={discountColumns}
        dataSource={discounts}
        rowKey="_id"
        rowSelection={{
          type: 'checkbox',
        }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record), // Điều hướng khi nhấn vào dòng
        })}
        onAddNew={handleAddNewDiscount} // Hàm thêm mới mã giảm giá
      />
    </div>
  );
};

export default DiscountTable;
