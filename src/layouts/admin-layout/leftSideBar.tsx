import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import {
  AppstoreOutlined,
  HomeOutlined,
  TagsOutlined,
  FileTextOutlined,
  BarChartOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { RootState } from "@redux/store";

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const user = useSelector((state: RootState) => state.persist);
  const role = useSelector(
    (state: RootState) => state.persist.auth.user?.user.role
  );

  const toggleCollapse = () => setCollapsed(!collapsed);

  const items: MenuProps["items"] = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: <Link to={role === "admin" ? "/admin" : "/"}>General</Link>,
    },
    {
      key: "2",
      icon: <ShoppingCartOutlined />,
      label: <Link to="/admin/order">Order</Link>,
    },
    {
      key: "sub1",
      icon: <AppstoreOutlined />,
      label: "Product",
      children: [
        {
          key: "3",
          label: <Link to="/admin/product/list">Product List</Link>,
        },
        {
          key: "4",
          label: <Link to="/admin/product/categories">Categories</Link>,
        },
      ],
    },
    {
      key: "5",
      icon: <FileTextOutlined />,
      label: <Link to="/admin/storage">Storage</Link>,
    },
    {
      key: "6",
      icon: <TagsOutlined />,
      label: <Link to="/admin/discount">Discount</Link>,
    },
    {
      key: "7",
      icon: <BarChartOutlined />,
      label: <Link to="/admin/statistic">Statistic</Link>,
    },
  ];

  return (
    <div className="h-full">
      <div className="p-4 text-center font-bold text-yellow-500 text-xl">
        <Link to={role === "admin" ? "/admin" : "/"}>Style</Link>
      </div>
      <Menu
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        style={{ height: "100%", borderRight: 0 }}
        items={items}
      />
    </div>
  );
};

export default Sidebar;
