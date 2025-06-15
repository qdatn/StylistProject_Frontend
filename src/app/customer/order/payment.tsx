import { notification } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import axiosClient from "@api/axiosClient";
import { motion } from "framer-motion";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const baseUrl = import.meta.env.VITE_API_URL;

  const [status, setStatus] = useState<"success" | "failed" | "pending">(
    "pending"
  );
  const [message, setMessage] = useState("");

  const updateOrderStatus = async () => {
    const orderId = localStorage.getItem("momo_order_id");

    if (!orderId) return;

    try {
      const updateStatus = await axiosClient.put(
        `${baseUrl}/api/order/${orderId}`,
        { status: "in progress" }
      );
      console.log("Updated order:", updateStatus);
      // Optionally clear localStorage
      localStorage.removeItem("momo_order_id");
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const resultCode = queryParams.get("resultCode");
    const msg = queryParams.get("message") || "Không rõ lý do.";

    if (resultCode === "0") {
      setStatus("success");
      setMessage("Payment Successfully! Thanks for your order!");
      updateOrderStatus();
      setTimeout(() => {
        navigate("/"); // Điều hướng sau vài giây nếu muốn
      }, 5000);
    } else {
      setStatus("failed");
      setMessage(`Payment fail! Reason: ${decodeURIComponent(msg)}`);
      setTimeout(() => {
        navigate("/cart"); // trở lại giỏ hàng
      }, 6000);
    }
  }, [location.search, navigate]);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl px-8 py-10 text-center">
        {status === "success" && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1.2 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <CheckCircleOutlined style={{ fontSize: 64, color: "green" }} />
            </motion.div>
            <h2 className="text-2xl font-bold mt-4 text-green-600">
              Payment Successfully! Redirect to homepage in 3 seconds.
            </h2>
            <p className="text-gray-700 mt-2">{message}</p>
          </>
        )}

        {status === "failed" && (
          <>
            <motion.div
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <CloseCircleOutlined style={{ fontSize: 64, color: "red" }} />
            </motion.div>
            <h2 className="text-2xl font-bold mt-4 text-red-600">
              Payment fail! Redirect to homepage in 3 seconds.
            </h2>
            <p className="text-gray-700 mt-2">{message}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
