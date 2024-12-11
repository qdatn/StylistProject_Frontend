"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import React, { useState, useRef, useEffect } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import GoogleLoginButton from "@components/GoogleLoginButton"; // Ensure this component exists
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@redux/store";
// import { useRouter } from "next/navigation";
import { setUser } from "@redux/reducers/authReducer";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import axiosClient from "@api/axiosClient";
import { UserLogin } from "@src/types/auth/AuthType";
import { Link, Navigate, redirect, useNavigate } from "react-router-dom";
import { Alert, notification } from "antd";

// Validation schema
const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Required")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[-_!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
});

// Initial form values
const initialValues = {
  email: "",
  password: "",
};

export default function Login() {
  // Call auth reducer from redux to store user that
  const dispatch: AppDispatch = useDispatch();

  const user = useSelector((state: RootState) => state.persist.auth);

  const [showPassword, setShowPassword] = useState(false);
  const formDataRef = useRef({ email: "", password: "" });
  const navigate = useNavigate();

  console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  const handleSubmit = async (values: { email: string; password: string }) => {
    formDataRef.current = {
      email: values.email,
      password: values.password,
    };

    try {
      const userLogin = await axiosClient.post<UserLogin>(
        "http://localhost:5000/api/auth/login",
        formDataRef.current
      );

      console.log("User login: ", userLogin);
      try {
        dispatch(setUser(userLogin));
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
    } catch (err: any) {
      notification.error({
        message: "Error",
        description: `Email or Password is not correct!`,
        placement: "topRight",
      });
    }
  };

  useEffect(() => {
    if (user) {
      if (user.user?.user.role === "admin") {
        navigate("/admin");
      } else if (user.user?.user.role === "customer") {
        navigate("/");
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    console.log("User redux:", user);
  }, [user]);

  useEffect(() => {
    // Xoá lịch sử để ngăn quay lại trang trước
    window.history.replaceState(null, "", "/login");
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-center mb-10 mt-0">
          <Link
            to="/"
            className="text-5xl tracking-wider font-bold text-gray-800"
          >
            STYLE
          </Link>
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              {/* Email Field */}
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
                  placeholder="Enter your email"
                  className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-gray-500"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Password Field */}
              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
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

              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-gray-600"
                  />
                  <span className="ml-2 text-gray-600 text-sm">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgotpassword"
                  className="text-sm text-gray-600 hover:text-gray-900 focus:outline-none"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-black text-white font-bold py-2 px-4 rounded hover:bg-gray-900 focus:outline-none focus:ring focus:border-gray-500 transition"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Log In"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <ErrorBoundary>
          <GoogleLoginButton />
        </ErrorBoundary>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don&#39;t have an account?
            <Link
              to="/register"
              className="text-gray-900 font-semibold hover:underline"
            >
              &nbsp;Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
