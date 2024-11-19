import React from "react";
import { useNavigate } from "react-router-dom";
import { Tag } from "antd";
import dayjs from "dayjs";
import CommonTable from "@components/ui/table";
import { ColumnsType } from "antd/es/table";
import { Product } from "@src/types/Product";

interface ProductTableProps {
  products: Product[];
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
    title: 'Quantity',
    dataIndex: 'stock_quantity',
  },
  {
    title: 'Original Price',
    dataIndex: 'originalPrice',
    render: (price: number) => `${price.toFixed(2)}£`,
  },
  {
    title: 'Discounted Price',
    dataIndex: 'discountedPrice',
    render: (price: number) => `${price.toFixed(2)}£`,
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

const ProductTable: React.FC<ProductTableProps> = ({
  products,
}) => {
  const navigate = useNavigate();

  const handleRowClick = (record: Product) => {
    // Điều hướng đến trang chỉnh sửa sản phẩm với ID của sản phẩm
    navigate(`/admin/product/list/edit/${record._id}`);
  };

  const handleAddNewProduct = () => {
    // Navigate to the ProductDetail page for adding a new product
    navigate('new');
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
        onAddNew={handleAddNewProduct}        
      />
    </div>
  );
};

export default ProductTable;
