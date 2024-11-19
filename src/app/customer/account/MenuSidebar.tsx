import axiosClient from "@api/axiosClient";
import { clearUser } from "@redux/reducers/authReducer";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "antd";
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
    <div className="w-1/4 bg-white rounded-lg shadow-lg mr-6">
      <div className="items-center w-full p-6">
        <Link to="/" className="text-xl font-bold text-gray-800">
          STYLE
        </Link>
      </div>
      <div className="flex items-center pl-2 pb-6">
        {/* <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-xl text-white font-bold mr-3">
          NH
        </div> */}
        {/* Avatar cho user */}
        <Avatar
          size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
          // className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-xl text-white font-bold mr-3"
          src={user?.avatar}
        />
        <div>
          <h2 className="text-lg font-semibold">{user?.name}</h2>
        </div>
      </div>

      <ul className="flex flex-col">
        <li className="text-gray-700 font-semibold p-4 hover:bg-gray-200">
          <Link to="/order">My Orders</Link>
        </li>
        <li className="text-gray-700 font-semibold p-4 hover:bg-gray-200">
          <Link to="/voucher">Gift Cards & Vouchers</Link>
        </li>
        <li className="text-gray-700 font-semibold p-4 hover:bg-gray-200">
          <Link to="/password">Password</Link>
        </li>
        <li className="text-gray-700 font-semibold p-4 hover:bg-gray-200">
          <Link onClick={handleLogout} to="/login">
            Sign Out
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default MenuSidebar;
