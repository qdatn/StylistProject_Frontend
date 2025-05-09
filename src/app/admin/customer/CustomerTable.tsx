import React from 'react';
import { useNavigate } from 'react-router-dom';
import CommonTable from '@components/ui/table'; // Giả sử bạn đã có component CommonTable
import { message, Tag } from 'antd';
import { UserAccount, CustomerList } from '@src/types/UserAccount'; // Import type của Customer
import { ColumnsType } from 'antd/es/table';
import axiosClient from '@api/axiosClient';
import { PaginationType } from '@src/types/Pagination';
import dayjs from 'dayjs';
import { formatCurrency, formatDate } from '@utils/format';
import { User } from '@src/types/auth/AuthType';

const baseUrl = import.meta.env.VITE_API_URL;

interface CustomerTableProps {
    customers: CustomerList; // Prop chứa danh sách đơn hàng
    onDeleteSuccess: () => void;
    onPageChange: (page: number, pageSize: number) => void;
    pagination: PaginationType;
}
const customerColumns: ColumnsType<UserAccount> = [
    {
        title: 'ID',
        dataIndex: '_id',
    },
    {
        title: 'User Email',
        dataIndex: 'user',
        render: (user: User) => user?.email || 'N/A', // Hiển thị email nếu tồn tại
    },
    {
        title: 'User Name',
        dataIndex: 'name',
    },
    {
        title: 'Phone number',
        dataIndex: 'phone_number',
    },
    {
        title: 'Created Date',
        dataIndex: 'create_date',
        render: formatDate, // Hiển thị ngày tạo
    },
];

const CustomerTable: React.FC<CustomerTableProps> = ({
    customers,
    onDeleteSuccess,
    onPageChange,
    pagination
}) => {
    const navigate = useNavigate();

    const handleRowClick = (record: UserAccount) => {
        // Điều hướng đến trang chi tiết hoặc chỉnh sửa đơn hàng
        navigate(`/admin/customer/edit/${record._id}`, {
            state: { order: record },
        });
    };

    const handleAddNewCustomer = () => {
        // Điều hướng đến trang thêm mới đơn hàng
        navigate('new');
    };
    const handleDeleteCustomers = async (selectedKeys: React.Key[]) => {
        try {
            await Promise.all(
                selectedKeys.map((id) =>
                    axiosClient.delete(`${baseUrl}/api/customer/${id}`)
                )
            );
            message.success("Customers deleted successfully");
        } catch (error) {
            console.error(error);
            message.error("Failed to delete Customers");
        }
    };

    console.log(customerColumns)
    return (
        <div>
            <CommonTable
                columns={customerColumns}
                dataSource={customers.data}
                rowKey="_id"
                rowSelection={{
                    type: 'checkbox',
                }}
                onRow={(record) => ({
                    onClick: () => handleRowClick(record), // Điều hướng khi nhấn vào dòng
                })}
                onAddNew={handleAddNewCustomer} // Hàm thêm mới đơn hàng
                //hideHideButton={true}
                hideAddButton={true}
                pagination={customers.pagination}
                onDeleteSuccess={onDeleteSuccess}
                onDelete={handleDeleteCustomers}
                onPageChange={onPageChange}
            />
        </div>
    );
};

export default CustomerTable;
