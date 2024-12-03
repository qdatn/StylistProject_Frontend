import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message, Tag } from "antd";
import dayjs from "dayjs";
import CommonTable from "@components/ui/table";
import { ColumnsType } from "antd/es/table";
import { Product, ProductList } from "@src/types/Product";
import { PaginationType } from "@src/types/Pagination";
import { Console } from "console";
import axiosClient from "@api/axiosClient";
import { formatCurrency, formatDate } from "@utils/format";

const baseUrl = import.meta.env.VITE_API_URL;

interface ProductTableProps {
  products: ProductList;
  onDeleteSuccess: () => void;
  onPageChange: (page: number, pageSize: number) => void;
  pagination: PaginationType;
}

const productColumns: ColumnsType<Product> = [
  {
    title: "Image",
    dataIndex: "images",
    render: (images: string) => (
      <img src={images[0]} alt="product" style={{ width: 50, height: 50 }} />
    ),
  },
  {
    title: "Name",
    dataIndex: "product_name",
  },
  {
    title: "Quantity",
    dataIndex: "stock_quantity",
  },
  {
    title: "Original Price",
    dataIndex: "price",
    render: formatCurrency,
  },
  {
    title: "Discounted Price",
    dataIndex: "discounted_price",
    render: formatCurrency,
  },
  {
    title: "Date Created",
    dataIndex: "createdAt",
    render: formatDate,
  },
  {
    title: "Status",
    dataIndex: "status",
    render: (status: boolean) => (
      <Tag color={status ? "green" : "volcano"}>
        {status ? "Available" : "Out of stock"}
      </Tag>
    ),
    filters: [
      { text: "Available", value: true },
      { text: "Unavailable", value: false },
    ],
    onFilter: (value, record) => record.status === value,
  },
];

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onDeleteSuccess,
  onPageChange,
  pagination
}) => {
  const navigate = useNavigate();

  const handleRowClick = (record: Product) => {
    // Điều hướng đến trang chỉnh sửa sản phẩm với ID của sản phẩm và đưa data của dòng được chọn qua để edit
    navigate(`/admin/product/list/edit/${record._id}`, {
      state: { product: record },
    });
    // console.log(record);
  };

  const handleAddNewProduct = () => {
    // Navigate to the ProductDetail page for adding a new product
    navigate("new");
  };

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
  return (
    <div>
      <CommonTable
        columns={productColumns}
        dataSource={products.data}
        rowKey="_id"
        rowSelection={{
          type: "checkbox",
        }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record), // Điều hướng khi nhấn vào dòng
        })}
        onAddNew={handleAddNewProduct}
        pagination={products.pagination}
        onPageChange={onPageChange}
        onDeleteSuccess={onDeleteSuccess}
        onDelete={handleDeleteProducts}
      />
    </div>
  );
};

export default ProductTable;
