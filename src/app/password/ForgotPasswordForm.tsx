import axiosClient from "@api/axiosClient";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.VITE_API_URL;
const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Email is not valid.");
      return;
    }
    console.log(email);
    try {
      const result: any = await axiosClient.post(
        `${baseUrl}/api/auth/check-email`,
        { email }
      );
      console.log(result.exists);
      if (result.exists) {
        const sendOTP = axiosClient.getOne(
          `${baseUrl}/api/auth/send-verification`,
          { email: email }
        );
        navigate("/OTP", {
          state: { registerData: { email: email }, status: "change-password" },
        });
      } else {
        setError(result.message);
        return;
      }
    } catch (error) {}
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          Enter Email
        </h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-600 mb-2">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            className={`w-full px-4 py-2 border ${
              error ? "border-red-500" : "border-gray-300"
            } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
        </div>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <button
          type="submit"
          disabled={!email}
          className="w-full py-2 text-white font-semibold bg-gray-800 rounded-sm hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Send OTP
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
