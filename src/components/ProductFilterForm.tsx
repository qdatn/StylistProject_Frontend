import React, { useState } from "react";
import { Input, Select, Button, Form, Row, Col } from "antd";

const { Option } = Select;

const FilterProduct: React.FC = () => {
  const [form] = Form.useForm();

  //   const handleFilter = async (values: any) => {
  //     try {
  //       const { name, category, sortBy, sortOrder } = values;

  //       // Gọi API để lọc sản phẩm
  //       const filteredProducts = await ProductService.filterProducts(
  //         name || "",
  //         category || "",
  //         sortBy || "createdDate",
  //         sortOrder || "asc"
  //       );

  //       console.log("Filtered Products:", filteredProducts); // Log kết quả sản phẩm
  //     } catch (error) {
  //       console.error("Error filtering products:", error);
  //     }
  //   };

  return (
    <div className="mt-20 mx-10">
      <Form
        form={form}
        layout="horizontal"
        // onFinish={handleFilter}
      >
        <Row gutter={16}>
          {/* <Col span={12}>
            <Form.Item label="Product Name" name="name">
              <Input placeholder="Enter product name" />
            </Form.Item>
          </Col> */}

          <Col span={8}>
            <Form.Item label="Category" name="category">
              <Select placeholder="Select category" allowClear>
                <Option value="electronics">Electronics</Option>
                <Option value="books">Books</Option>
                <Option value="clothing">Clothing</Option>
                {/* Thêm các danh mục khác nếu cần */}
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Sort By" name="sortBy">
              <Select
                placeholder="Select field to sort"
                defaultValue="createdDate"
              >
                <Option value="createdDate">Created Date</Option>
                <Option value="price">Price</Option>
                <Option value="name">Name</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Sort Order" name="sortOrder">
              <Select placeholder="Select sort order" defaultValue="asc">
                <Option value="asc">Ascending</Option>
                <Option value="desc">Descending</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24} style={{ textAlign: "right" }}>
            <Button type="primary" htmlType="submit">
              Filter
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default FilterProduct;
