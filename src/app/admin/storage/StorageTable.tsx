import React from 'react';
import CommonTable from '@components/ui/table'; // Giả sử bạn đã có component CommonTable
import { Tag } from 'antd';
import { Product } from '@src/types/Product';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
interface StorageTableProps {
    products: Product[];
}
const productColumns: ColumnsType<Product> = [
    {
        title: 'ID',
        dataIndex: '_id',
    },
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

const StorageTable: React.FC<StorageTableProps> = ({
    products,
}) => {
    const navigate = useNavigate();

    const handleRowClick = (record: Product) => {
        navigate(`/admin/storage/edit/${record._id}`);
    };
    return (
        <div>
            <CommonTable
                columns={productColumns}
                dataSource={products}
                rowKey="_id"
                rowSelection={{
                    type: 'checkbox',
                }}
                onRow={(record) => ({
                    onClick: () => handleRowClick(record), // Điều hướng khi nhấn vào dòng
                })}
                hideAddButton={true}
            />
        </div>
    );
};

export default StorageTable;
