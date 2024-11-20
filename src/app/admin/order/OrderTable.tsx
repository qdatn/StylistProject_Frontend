import React from 'react';
import { useNavigate } from 'react-router-dom';
import CommonTable from '@components/ui/table'; // Giả sử bạn đã có component CommonTable
import { Tag } from 'antd';
import { Order } from '@src/types/Order'; // Import type của Order
import { ColumnsType } from 'antd/es/table';

interface OrderTableProps {
  orders: Order[]; // Prop chứa danh sách đơn hàng
}

const orderColumns:  ColumnsType<Order>=[
  {
    title: 'ID',
    dataIndex: '_id',
  },
  {
    title: 'User',
    dataIndex: 'user',
  },
  {
    title: 'Total Price',
    dataIndex: 'total_price',
    render: (price: number) => `£${price.toFixed(2)}`, // Hiển thị giá tiền với định dạng USD
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (status: string) => {
      let color = 
        status === 'pending' ? 'orange' :
        status === 'shipped' ? 'blue' :
        status === 'delivered' ? 'green' :
        status === 'canceled' ? 'red' : 'gray';
      
      return <Tag color={color}>{status.toUpperCase()}</Tag>;
    },
    filters: [
      { text: 'Pending', value: 'pending' },
      { text: 'Shipped', value: 'shipped' },
      { text: 'Delivered', value: 'delivered' },
      { text: 'Canceled', value: 'canceled' },
    ],
    onFilter: (value,record) => record.status === value,
  },
  {
    title: 'Created Date',
    dataIndex: 'create_date',
    render: (date: Date) => new Date(date).toLocaleDateString(), // Hiển thị ngày tạo
  },
];

const OrderTable: React.FC<OrderTableProps> = ({ orders }) => {
  const navigate = useNavigate();

  const handleRowClick = (record: Order) => {
    // Điều hướng đến trang chi tiết hoặc chỉnh sửa đơn hàng
    navigate(`/admin/order/edit/${record._id}`);
  };

  const handleAddNewOrder = () => {
    // Điều hướng đến trang thêm mới đơn hàng
    navigate('new');
  };

  return (
    <div>
      <div>

      </div>
      <CommonTable
        columns={orderColumns}
        dataSource={orders}
        rowKey="_id"
        rowSelection={{
          type: 'checkbox',
        }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record), // Điều hướng khi nhấn vào dòng
        })}
        onAddNew={handleAddNewOrder} // Hàm thêm mới đơn hàng
        hideHideButton={true}
      />
    </div>
  );
};

export default OrderTable;
