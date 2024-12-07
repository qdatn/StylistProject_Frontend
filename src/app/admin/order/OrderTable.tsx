import React from 'react';
import { useNavigate } from 'react-router-dom';
import CommonTable from '@components/ui/table'; // Giả sử bạn đã có component CommonTable
import { message, Tag } from 'antd';
import { Order, OrderList, OrderListAdmin, OrderTracking } from '@src/types/Order'; // Import type của Order
import { ColumnsType } from 'antd/es/table';
import axiosClient from '@api/axiosClient';
import { PaginationType } from '@src/types/Pagination';
import dayjs from 'dayjs';
import { formatCurrency, formatDate } from '@utils/format';

const baseUrl = import.meta.env.VITE_API_URL;

interface OrderTableProps {
  orders: OrderListAdmin; // Prop chứa danh sách đơn hàng
  onDeleteSuccess: () => void;
  onPageChange: (page: number, pageSize: number) => void;
  pagination: PaginationType;
}

const orderColumns: ColumnsType<Order> = [
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
    render: formatCurrency,
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
    onFilter: (value, record) => record.status === value,
  },
  {
    title: 'Created Date',
    dataIndex: 'createdAt',
    render: formatDate, // Hiển thị ngày tạo
  },
];

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  onDeleteSuccess,
  onPageChange,
  pagination
}) => {
  const navigate = useNavigate();

  const handleRowClick = (record: Order) => {
    // Điều hướng đến trang chi tiết hoặc chỉnh sửa đơn hàng
    navigate(`/admin/order/edit/${record._id}`, {
      state: { order: record },
    });
  };

  const handleAddNewOrder = () => {
    // Điều hướng đến trang thêm mới đơn hàng
    navigate('new');
  };
  const handleDeleteOrders = async (selectedKeys: React.Key[]) => {
    try {
      await Promise.all(
        selectedKeys.map((id) =>
          axiosClient.delete(`${baseUrl}/api/order/${id}`)
        )
      );
      message.success("Orders deleted successfully");
    } catch (error) {
      console.error(error);
      message.error("Failed to delete Orders");
    }
  };
  return (
    <div>
      <CommonTable
        columns={orderColumns}
        dataSource={orders.data}
        rowKey="_id"
        rowSelection={{
          type: 'checkbox',
        }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record), // Điều hướng khi nhấn vào dòng
        })}
        onAddNew={handleAddNewOrder} // Hàm thêm mới đơn hàng
        hideHideButton={true}
        hideAddButton={true}
        pagination={orders.pagination}
        onDeleteSuccess={onDeleteSuccess}
        onDelete={handleDeleteOrders}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default OrderTable;
