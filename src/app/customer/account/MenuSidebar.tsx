import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Menu } from "antd";
import { UserOutlined, FileTextOutlined, TagsOutlined, LockOutlined, LogoutOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import axiosClient from "@api/axiosClient";
import { clearUser } from "@redux/reducers/authReducer";
import { UserAccount } from "@src/types/UserAccount";

interface AccountDetailsProps {
  user: UserAccount | null;
}

const MenuSidebar: React.FC<AccountDetailsProps> = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    const logout = axiosClient.post("http://localhost:5000/api/auth/login", {});
    dispatch(clearUser());
    navigate("/login");
  };
  return (
    <div className="w-1/4 bg-slate-900 rounded-lg shadow-lg mr-6">
      <div className="items-center w-full p-6">
      </div>
      <div className="flex flex-col items-center mb-6">
        <Avatar
          size={80}
          src={user?.avatar}
          icon={<UserOutlined />}
          className="mr-4"
        />
        <div>
          <h2 className="text-white text-lg font-semibold break-words p-2">{user?.name}</h2>
        </div>
      </div>

      <Menu
        mode="vertical"
        theme="dark"
        style={{ width: '100%' }}
        className="w-full"
      >
        <Menu.Item key="1" icon={<FileTextOutlined />}>
          <Link to="/order">My Orders</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<TagsOutlined />}>
          <Link to="/voucher">Gift Cards & Vouchers</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<LockOutlined />}>
          <Link to="/password">Password</Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<LogoutOutlined />} onClick={handleLogout}>
          Sign Out
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default MenuSidebar;
