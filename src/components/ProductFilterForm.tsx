import React, { useEffect, useState } from "react";
import { Input, Select, Button, Form, Row, Col } from "antd";
import axiosClient from "@api/axiosClient";
import { Category, CategoryList } from "@src/types/Category";
import { ProductList } from "@src/types/Product";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const { Option } = Select;

const FilterProduct: React.FC = () => {
  const baseUrl = import.meta.env.VITE_API_URL;
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<Category[]>();
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name") || "";
  const navigate = useNavigate();

  const fetchAttributes = async () => {
    try {
      const categories = await axiosClient.getOne<CategoryList>(
        `${baseUrl}/api/category`,
        { params: { page: 1, limit: 1000 } }
      );

      setCategories(categories?.data);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, []);
  useEffect(() => {
    // Reset các giá trị trong form khi 'name' thay đổi
    form.setFieldsValue({
      category: "All", // Reset category
      sortBy: "product_name", // Reset sortBy
      sortOrder: "asc", // Reset sortOrder
    });
  }, [name, form]);

  const handleFilter = async (values: any) => {
    try {
      const { category, sortBy, sortOrder } = values;

      navigate(
        `/product/search/query?name=${name}&category=${category}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      );
    } catch (error) {
      console.error("Error filtering products:", error);
    }
  };

  return (
    <div className="mt-20 mx-10">
      <Form form={form} layout="horizontal" onFinish={handleFilter}>
        <Row gutter={16}>
          {/* <Col span={12}>
            <Form.Item label="Product Name" name="name">
              <Input placeholder="Enter product name" />
            </Form.Item>
          </Col> */}

          <Col span={8}>
            <Form.Item label="Category" name="category">
              <Select placeholder="Select category" allowClear>
                <Option value="All">All</Option>
                {categories?.map((category) => (
                  <Option key={category._id} value={category.category_name}>
                    {category.category_name}
                  </Option>
                ))}
                {/* Thêm các danh mục khác nếu cần */}
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Sort By" name="sortBy">
              <Select placeholder="Select field to sort">
                {/* <Option value="createdDate">Created Date</Option> */}
                <Option key="product_name" value="product_name">
                  Product Name
                </Option>
                <Option key="price" value="price">
                  Price
                </Option>
                <Option key="brand" value="brand">
                  Brand
                </Option>
                <Option key="sold_quantity" value="sold_quantity">
                  Best seller
                </Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Sort Order" name="sortOrder">
              <Select placeholder="Select sort order">
                <Option key="asc" value="asc">
                  Ascending
                </Option>
                <Option key="desc" value="desc">
                  Descending
                </Option>
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
