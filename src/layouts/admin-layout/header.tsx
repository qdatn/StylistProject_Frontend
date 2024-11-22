// components/Header.tsx
import axiosClient from "@api/axiosClient";
import { clearUser } from "@redux/reducers/authReducer";
import { AppDispatch, RootState } from "@redux/store";
import React, { useEffect, useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const user = useSelector((state: RootState) => state.auth);
  const isLogin = useSelector((state: RootState) => state.auth.auth.isLogin);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  // State to manage hover visibility
  const [showPopup, setShowPopup] = useState(false);

  const handleProfileClick = () => {
    if (user.auth.isLogin) {
      setShowPopup(!showPopup);
    }
    // else {
    //   navigate("/login");
    // }
  };

  const handleMouseLeave = () => {
    setShowPopup(false);
  };

  const handleLogout = () => {
    dispatch(clearUser());
    const logout = axiosClient.post(
      "http://localhost:5000/api/auth/logout",
      {}
    );
    navigate("/login");
  };

  //   useEffect(() => {
  //     // Nếu người dùng chưa xác thực, chuyển hướng về trang /home
  //     if (!isLogin) {
  //       navigate("/", { replace: true });
  //     }
  //   }, [isLogin, navigate]);

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md">
      {/* Tìm kiếm */}
      <div className="w-2/3">
        <input
          type="text"
          placeholder="Tìm kiếm (Ctrl + K)"
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Thông tin người dùng */}
      <div className="flex items-center space-x-4">
        <IoNotificationsOutline className=" text-gray-800 hover:text-yellow-500 w-7 h-7" />

        <div className="flex items-center space-x-2">
          <span className="text-gray-800 font-semibold">Admin StylistLeo</span>
          <div className="flex-col relative">
            <div
              className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white"
              onClick={handleProfileClick}
            >
              St
            </div>
            {/* Popup (visible on hover) */}
            {showPopup && user.auth.isLogin && (
              <div
                className="absolute left-0 mt-2 w-40 p-2 bg-white border rounded-lg shadow-md z-10"
                // onClick={handleProfileClick}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
