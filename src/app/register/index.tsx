"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import React, { useState, useRef } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import axios from "axios";
// import { useRouter } from "next/navigation";

const validationSchema = Yup.object({
  name: Yup.string().required("Required"),
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
  confirmedPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Required")
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Required"),
  condition: Yup.bool().oneOf(
    [true],
    "You need to accept our terms and conditions"
  ),
});

const initialValues = {
  name: "",
  email: "",
  password: "",
  confirmedPassword: "",
  condition: false,
};

export default function Register() {
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const formDataRef = useRef({ email: "", password: "", role: "customer" });

  const apiUrl = import.meta.env.VITE_API_URL || "https://localhost:5000";

  // const router = useRouter(); // hook để chuyển hướng

  // Define form submission handler
  const handleSubmit = async (values: {
    name: string;
    email: string;
    password: string;
    confirmedPassword: string;
    condition: boolean;
  }) => {
    console.log("Registration data:", values);
    // Logic to handle registration, e.g., call registration API
    formDataRef.current = {
      email: values.email,
      password: values.password,
      role: "customer",
    };
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formDataRef.current
      );
      alert("Registration successful!");
      // router.push("/login");
    } catch (err: any) {
      alert("Error: " + err.response.data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        {/* LOGO BEGIN */}
        <div className="flex justify-center mb-10 mt-0">
          <a
            href="/"
            className="text-5xl tracking-wider font-bold text-gray-800"
          >
            STYLE
          </a>
        </div>
        {/* LOGO END*/}

        {/* REGISTER FIELD BEGIN */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Sign Up
        </h2>

        {/* Formik Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              {/* Name Field */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Full Name
                </label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-gray-500"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Email Field */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <Field
                  type="email"
                  id="email"
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
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className=" relative">
                  <Field
                    type={showPassword ? "text" : "password"} // Toggle between text and password types
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-gray-500"
                  />
                  {/* Button to toggle password visibility */}
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

              {/* Confirm Password Field */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="confirmedPassword"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Field
                    type={showPassword ? "text" : "password"} // Toggle between text and password types
                    id="confirmedPassword"
                    name="confirmedPassword"
                    placeholder="Confirm your password"
                    className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-gray-500"
                  />
                  {/* Button to toggle password visibility */}
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
                  name="confirmedPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Terms and Conditions Checkbox */}
              <div className="flex items-center mb-2">
                <label className="flex items-center">
                  <Field
                    type="checkbox"
                    id="condition"
                    name="condition"
                    className="form-checkbox h-4 w-4 text-gray-600"
                  />
                  <span className="ml-2 text-gray-600 text-sm">
                    I agree to the terms and conditions
                  </span>
                </label>
              </div>
              <ErrorMessage
                name="condition"
                component="div"
                className="text-red-500 text-sm mt-1 pb-2"
              />

              {/* Sign Up Button */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-black text-white font-bold py-2 px-4 rounded hover:bg-gray-900 focus:outline-none focus:ring focus:border-gray-500 transition"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing Up..." : "Sign Up"}
                </button>
              </div>
            </Form>
          )}
        </Formik>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?
            <a
              href="/login"
              className="text-gray-900 font-semibold hover:underline"
            >
              &nbsp;Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
