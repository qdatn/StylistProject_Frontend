import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import axiosClient from "@api/axiosClient";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "@redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@redux/reducers/authReducer";
import { UserLogin } from "@src/types/auth/AuthType";
import { Button, Input, Modal, notification } from "antd";
import bcrypt from "bcryptjs";

const GoogleLoginButton = () => {
  const dispatch: AppDispatch = useDispatch();
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [userInfo, setUserInfo] = useState<UserLogin | null>(null);
  const user = useSelector((state: RootState) => state.persist.auth);

  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: any) => {
    console.log("Login Success", credentialResponse);
    const token = credentialResponse.credential; // Token từ Google

    try {
      const response = await axiosClient.post<UserLogin>(
        "http://localhost:5000/api/auth/google-login",
        { token }
      );

      const isPasswordMatch = await bcrypt.compare(
        "1234",
        response.user.password
      );
      // Kiểm tra xem người dùng đã có mật khẩu chưa
      if (isPasswordMatch) {
        // Nếu chưa có mật khẩu, hiển thị modal nhập mật khẩu
        setUserInfo(response);
        setIsPasswordModalVisible(true);
      } else {
        // Nếu người dùng đã có mật khẩu, không cần hiển thị modal
        dispatch(setUser(response));
        notification.success({
          message: "Login successful!",
          description: "You have successfully logged in.",
          placement: "topRight",
          duration: 2,
        });
      }

      console.log("User authenticated:", response);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handlePasswordSubmit = async () => {
    if (!password || password.length < 6) {
      notification.error({
        message: "Password too short",
        description: "Password must be at least 6 characters.",
        placement: "topRight",
        duration: 2,
      });
      return;
    }

    if (userInfo) {
      try {
        // Gửi mật khẩu mới để lưu vào DB
        const response = await axiosClient.post<UserLogin>(
          "http://localhost:5000/api/auth/set-password",
          {
            userId: userInfo.user._id,
            password,
          }
        );

        // Cập nhật Redux state
        dispatch(setUser(response));

        notification.success({
          message: "Password set successfully!",
          description: "Your password has been saved.",
          placement: "topRight",
          duration: 2,
        });

        setIsPasswordModalVisible(false);
        navigate("/"); // Sau khi thành công, điều hướng đến trang chủ
      } catch (error) {
        console.error("Password set failed:", error);
        notification.error({
          message: "Error",
          description: "There was an error saving your password.",
          placement: "topRight",
          duration: 2,
        });
      }
    }
  };

  const handleError = () => {
    console.error("Login Failed");
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

      {/* Modal để nhập mật khẩu mới */}
      <Modal
        title="Set Your Password"
        visible={isPasswordModalVisible}
        onCancel={() => setIsPasswordModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsPasswordModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handlePasswordSubmit}>
            Submit
          </Button>,
        ]}
      >
        <Input.Password
          value={password}
          onChange={handlePasswordChange}
          placeholder="Enter your password"
        />
      </Modal>
    </div>
  );
};

export default GoogleLoginButton;
