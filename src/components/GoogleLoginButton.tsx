import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import axiosClient from "@api/axiosClient";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "@redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@redux/reducers/authReducer";
import { UserLogin } from "@src/types/auth/AuthType";
import { notification } from "antd";

const GoogleLoginButton = () => {
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.persist.auth);

  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: any) => {
    console.log("Login Success", credentialResponse);
    // You can handle authentication success here, e.g., send token to backend

    const token = credentialResponse.credential; // Token từ Google

    try {
      // Gửi token đến backend để đăng nhập hoặc tạo tài khoản
      const response = await axiosClient.post<UserLogin>(
        "http://localhost:5000/api/auth/google-login",
        { token }
      );

      try {
        dispatch(setUser(response));
        notification.success({
          message: "Login successful!",
          description: "You have successfully logged in.",
          placement: "topRight",
          duration: 2,
        });
      } catch {
        notification.error({
          message: "Error",
          description: "Can't set redux state properly.",
          placement: "topRight",
          duration: 1,
        });
      }
    
      console.log("User authenticated:", response);
      navigate("/");
      // Lưu thông tin người dùng trong Redux hoặc LocalStorage nếu cần
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleError = () => {
    console.error("Login Failed");
    // Consider showing a user-friendly message or triggering retry
  };

  const login = useGoogleLogin({
    onSuccess: handleSuccess,
    onError: handleError,
  });

  return (
    <div className="mt-4">
      {/* Custom styled button */}
      <button
        className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
        onClick={() => {
          login();
        }}
      >
        <FcGoogle className="mr-2" size={20} /> Login with Google
      </button>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
        // className="hidden"
      />
    </div>
  );
};

export default GoogleLoginButton;
