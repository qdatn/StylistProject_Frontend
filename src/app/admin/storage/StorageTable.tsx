import React from 'react';
import CommonTable from '@components/ui/table'; // Giả sử bạn đã có component CommonTable
import { Tag } from 'antd';
import { Product } from '@src/types/Product';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
interface StorageTableProps {
    products: Product[];
    onStorageUpdate: (updatedProduct: Product) => void; // Nhận hàm cập nhật sản phẩm từ prop
}
const productColumns: ColumnsType<Product> = [

    {
        title: 'Image',
        dataIndex: 'image',
        render: (image: string) => <img src={image[0]} alt="product" style={{ width: 50, height: 50 }} />,
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
        onFilter: (value, record) => record.status === value,
    },
];

const StorageTable: React.FC<StorageTableProps> = ({
    products,
    onStorageUpdate,
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
                onProductUpdate={onStorageUpdate} // Truyền hàm cập nhật cho CommonTable (hoặc xử lý sự kiện cập nhật sản phẩm)
                hideAddButton={true}
            />
        </div>
    );
};

export default StorageTable;
