import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react"; // hoặc thay bằng icon/logo riêng
import React from "react";

const parentVariants = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const childVariants = {
  animate: {
    y: ["0%", "-30%", "0%"],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut" as const, // ✅ dùng chuỗi hợp lệ
    },
  },
};

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      {/* Logo + Brand Name */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center space-x-3 mb-6"
      >
        <ShoppingCart className="text-orange-500 w-10 h-10" />
        <h1 className="text-3xl font-bold text-gray-800 tracking-wide">
          STYLE
        </h1>
      </motion.div>

      {/* Bouncing dots */}
      <motion.div
        variants={parentVariants}
        animate="animate"
        className="flex space-x-2"
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-3 h-3 bg-orange-500 rounded-full"
            variants={childVariants}
          />
        ))}
      </motion.div>

      {/* Optional: Text below */}
      <p className="mt-4 text-sm text-gray-500">Loading data</p>
    </div>
  );
}
