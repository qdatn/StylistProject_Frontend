import React from 'react';
import CommonTable from '@components/ui/table'; // Giả sử bạn đã có component CommonTable
import { message, Tag } from 'antd';
import { Product, ProductList } from '@src/types/Product';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import axiosClient from '@api/axiosClient';
import { PaginationType } from '@src/types/Pagination';

const baseUrl = import.meta.env.VITE_API_URL;

interface StorageTableProps {
    products: ProductList;
    onDeleteSuccess: () => void;
    onPageChange: (page: number, pageSize: number) => void;
    pagination: PaginationType;
}
const productColumns: ColumnsType<Product> = [
    {
        title: 'Image',
        dataIndex: 'images',
        render: (images: string) => <img src={images[0]} alt="product" style={{ width: 50, height: 50 }} />,
    },
    {
        title: 'Name',
        dataIndex: 'product_name',
    },
    {
        title: 'Min Quantity',
        dataIndex: 'min_quantity',
    },
    {
        title: 'Sold Quantity',
        dataIndex: 'sold_quantity',
    },
    {
        title: 'Quantity',
        dataIndex: 'stock_quantity',
    },

    {
        title: 'Date Created',
        dataIndex: 'createdAt',
        render: (createdAt: string) => dayjs(createdAt).format('DD/MM/YYYY'),
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
        onFilter: (value, record) => record.status === value,
    },
];
const handleDeleteProducts = async (selectedKeys: React.Key[]) => {
    try {
        await Promise.all(
            selectedKeys.map((id) =>
                axiosClient.delete(`${baseUrl}/api/product/${id}`)
            )
        );
        message.success("Products deleted successfully");
    } catch (error) {
        console.error(error);
        message.error("Failed to delete products");
    }
};
const StorageTable: React.FC<StorageTableProps> = ({
    products,
    onDeleteSuccess,
    onPageChange,
    pagination
}) => {
    const navigate = useNavigate();

    const handleRowClick = (record: Product) => {
        navigate(`/admin/storage/edit/${record._id}`, {
            state: { product: record },
        });
    };
    return (
        <div>
            <CommonTable
                columns={productColumns}
                dataSource={products.data}
                rowKey="_id"
                rowSelection={{
                    type: 'checkbox',
                }}
                onRow={(record) => ({
                    onClick: () => handleRowClick(record), // Điều hướng khi nhấn vào dòng
                })}
                hideAddButton={true}
                pagination={products.pagination}
                onDeleteSuccess={onDeleteSuccess}
                onDelete={handleDeleteProducts}
                onPageChange={onPageChange}
            />
        </div>
    );
};

export default StorageTable;
