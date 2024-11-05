"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState, useRef } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import GoogleLoginButton from "@components/GoogleLoginButton";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@redux/store";
import { setUser } from "@redux/reducers/userReducer";
import { useNavigate } from "react-router-dom";

// Xác định các quy tắc xác thực với Yup
const validationSchema = Yup.object({
  email: Yup.string().email("Địa chỉ email không hợp lệ").required("Bắt buộc"),
  password: Yup.string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Bắt buộc")
    .matches(/[A-Z]/, "Mật khẩu phải có ít nhất một chữ cái in hoa")
    .matches(/\d/, "Mật khẩu phải có ít nhất một chữ số")
    .matches(
      /[-_!@#$%^&*(),.?":{}|<>]/,
      "Mật khẩu phải có ít nhất một ký tự đặc biệt"
    ),
});

// Giá trị khởi tạo
const initialValues = {
  email: "",
  password: "",
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const formDataRef = useRef({ email: "", password: "" });
  const dispatch: AppDispatch = useDispatch();
  const User = useSelector((state: RootState) => state.user);

  const navigate = useNavigate();

  const handleSubmit = async (values: { email: string; password: string }) => {
    console.log("Dữ liệu đăng nhập:", values);
    formDataRef.current = {
      email: values.email,
      password: values.password,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formDataRef.current
      );
      const { user, token } = response.data;
      dispatch(setUser({ email: values.email, token }));
      alert("Đăng nhập thành công!");
      navigate("/");
    } catch (err: any) {
      alert("Lỗi: " + err.response?.data?.message || "Không thể đăng nhập");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        {/* Logo */}
        <div className="flex justify-center mb-10 mt-0">
          <a href="/" className="text-5xl tracking-wider font-bold text-gray-800">
            STYLE
          </a>
        </div>

        {/* Tiêu đề đăng nhập */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Đăng nhập
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              {/* Trường Email */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  placeholder="Nhập email của bạn"
                  className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-gray-500"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Trường Mật khẩu */}
              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Mật khẩu
                </label>
                <div className="relative">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Nhập mật khẩu của bạn"
                    className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-700"
                  >
                    {showPassword ? (
                      <AiFillEyeInvisible size={24} />
                    ) : (
                      <AiFillEye size={24} />
                    )}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Ghi nhớ và Quên mật khẩu */}
              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-gray-600"
                  />
                  <span className="ml-2 text-gray-600 text-sm">
                    Ghi nhớ tôi
                  </span>
                </label>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-900 focus:outline-none"
                >
                  Quên mật khẩu?
                </a>
              </div>

              {/* Nút Đăng nhập */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-black text-white font-bold py-2 px-4 rounded hover:bg-gray-900 focus:outline-none focus:ring focus:border-gray-500 transition"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
              </div>
            </Form>
          )}
        </Formik>

        {/* Đăng nhập với Google */}
        <GoogleLoginButton />

        {/* Link đến trang Đăng ký */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Chưa có tài khoản?
            <a
              href="/register"
              className="text-gray-900 font-semibold hover:underline"
            >
              &nbsp;Đăng ký
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
