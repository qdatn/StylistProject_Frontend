import { Notification, NotificationList } from "@src/types/Notification";
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CommonTable from '@components/ui/table'; // Giả sử bạn đã có component CommonTable
import { message, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import axiosClient from '@api/axiosClient';
import { PaginationType } from '@src/types/Pagination';
import { formatDate } from '@utils/format';
import { User } from "@src/types/auth/AuthType";
import { UserAccount } from "@src/types/UserAccount";

const baseUrl = import.meta.env.VITE_API_URL;

interface NotificationTableProps {
  notices: NotificationList; // Prop chứa danh sách mã giảm giá
  onDeleteSuccess: () => void;
  onPageChange: (page: number, pageSize: number) => void;
  pagination: PaginationType;
}

const notificationColumns: ColumnsType<Notification> = [
  {
    title: 'ID',
    dataIndex: '_id',
  },
  {
    title: 'Title',
    dataIndex: 'title',
  },
  {
    //'general', 'user', 'system', 'event', 'alert', 'custom'
    title: 'Type',
    dataIndex: 'type',
    render: (status: string) => {
      let color =
        status === 'event' ? 'green' :
          status === 'custom' ? 'orange' : 'blue';
      return <Tag color={color}>{status.toUpperCase()}</Tag>;
    },
    filters: [
      { text: 'General', value: 'general' },
      { text: 'User', value: 'user' },
      { text: 'System', value: 'system' },
      { text: 'Event', value: 'event' },
      { text: 'Alert', value: 'alert' },
      { text: 'Custom', value: 'custom' },
    ],
    onFilter: (value, record) => record.type === value,
  },
  {
    //'low', 'medium', 'high'
    title: 'Priority',
    dataIndex: 'priority',
    render: (status: string) => {
      let color =
        status === 'high' ? 'red' :
          status === 'medium' ? 'blue' : 'gray';
      return <Tag color={color}>{status.toUpperCase()}</Tag>;
    },
    filters: [
      { text: 'High', value: 'high' },
      { text: 'Medium', value: 'medium' },
      { text: 'Low', value: 'low' },
    ],
    onFilter: (value, record) => record.type === value,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (status: string) => {
      let color =
        status === 'unread' ? 'gray' : 'green'
      return <Tag color={color}>{status.toUpperCase()}</Tag>;
    },
    filters: [
      { text: 'Read', value: 'read' },
      { text: 'Unread', value: 'unread' },
    ],
    onFilter: (value, record) => record.type === value,
  },
  {
    title: 'Create Date',
    dataIndex: 'createdAt',
    render: formatDate,
  },
  {
    title: 'Update Date',
    dataIndex: 'updatedAt',
    render: formatDate,
  },
];

const NotificationTable: React.FC<NotificationTableProps> = ({ notices, onDeleteSuccess, onPageChange, pagination }) => {
  const navigate = useNavigate();

  const handleRowClick = (record: Notification) => {
    // Điều hướng đến trang chi tiết hoặc chỉnh sửa mã giảm giá
    navigate(`/admin/notification/list/edit/${record._id}`, {
      state: { notice: record },
    });
  };

  const handleAddNewNotification = () => {
    navigate('new');
  };
  const handleDeleteNotifications = async (selectedKeys: React.Key[]) => {
    try {
      await Promise.all(
        selectedKeys.map((id) =>
          axiosClient.delete(`${baseUrl}/api/notification/${id}`)
        )
      );
      message.success("Notifications deleted successfully");
    } catch (error) {
      console.error(error);
      message.error("Failed to delete Notifications");
    }
  };
  return (
    <div>
      <CommonTable
        columns={notificationColumns}
        dataSource={notices.data}
        rowKey="_id"
        rowSelection={{
          type: 'checkbox',
        }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record), // Điều hướng khi nhấn vào dòng
        })}
        onAddNew={handleAddNewNotification} // Hàm thêm mới mã giảm giá
        onDeleteSuccess={onDeleteSuccess}
        onDelete={handleDeleteNotifications}
        pagination={notices.pagination}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default NotificationTable;
