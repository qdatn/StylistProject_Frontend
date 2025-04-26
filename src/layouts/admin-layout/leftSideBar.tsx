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
  MessageOutlined,
} from "@ant-design/icons";
import { IoPeopleOutline } from "react-icons/io5";
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
    {
      key: "8",
      icon: <IoPeopleOutline />,
      label: <Link to="/admin/customer">Customer</Link>,
    },
    {
      key: "9",
      icon: <MessageOutlined />,
      label: <Link to="/admin/chat">Message</Link>,
    },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-900">
      <div className="p-5 text-center font-bold text-white text-2xl border-b-2 border-gray-500">
        <Link to={role === "admin" ? "/admin" : "/"}>Style</Link>
      </div>
      <Menu
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        style={{ borderRight: 0, width: "200px", fontSize: "16px" }}
        items={items}
      ></Menu>
    </div>
  );
};

export default Sidebar;
