import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tag } from "antd";
import dayjs from "dayjs";
import CommonTable from "@components/ui/table";
import { ColumnsType } from "antd/es/table";
import { Product, ProductList } from "@src/types/Product";
import { PaginationType } from "@src/types/Pagination";
import { Console } from "console";

interface ProductTableProps {
  products: ProductList;
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
    render: (price: number) =>
      typeof price === "number" ? `${price.toFixed(2)}£` : price,
  },
  {
    title: "Discounted Price",
    dataIndex: "discountedPrice",
    render: (price: number) =>
      typeof price === "number" ? `${price.toFixed(2)}£` : price,
  },
  {
    title: "Date Created",
    dataIndex: "createdAt",
    render: (createdAt: string) => dayjs(createdAt).format("DD/MM/YYYY"),
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

const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
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

  // useEffect(() => {
  //   console.log("PRODUCT", products);
  // });

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
      />
    </div>
  );
};

export default ProductTable;
