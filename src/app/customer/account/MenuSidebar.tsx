import axiosClient from "@api/axiosClient";
import { clearUser } from "@redux/reducers/authReducer";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const MenuSidebar = () => {
<<<<<<< HEAD
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
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-xl text-white font-bold mr-3">
          NH
=======
    return (
        <div className="w-1/4 bg-white rounded-lg shadow-lg mr-6">
            <div className="items-center w-full p-6">
                <Link to="/" className="text-xl font-bold text-gray-800">
                    STYLE
                </Link>
            </div>
            <div className="flex items-center pl-2 pb-6">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-xl text-white font-bold mr-3">
                    NH
                </div>
                <div>
                    <h2 className="text-lg font-semibold">Nguyễn Hương</h2>
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
                    <Link to="/login">Sign Out</Link>
                </li>
            </ul>
>>>>>>> huong
        </div>
        <div>
          <h2 className="text-lg font-semibold">Nguyễn Hương</h2>
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
