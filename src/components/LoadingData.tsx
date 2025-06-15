import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
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
      ease: "easeInOut" as const,
    },
  },
};

export default function LoadingData() {
  return (
    <div className="flex flex-col items-center justify-center py-10 min-h-[200px]">
      {/* Logo + Brand Name */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center space-x-2 mb-4"
      >
        <ShoppingCart className="text-orange-500 w-6 h-6" />
        <h2 className="text-lg font-semibold text-gray-700 tracking-wide">
          STYLE
        </h2>
      </motion.div>

      {/* Bouncing dots */}
      <motion.div
        variants={parentVariants}
        animate="animate"
        className="flex space-x-1"
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2.5 h-2.5 bg-orange-500 rounded-full"
            variants={childVariants}
          />
        ))}
      </motion.div>

      {/* Optional: Text below */}
      <p className="mt-2 text-xs text-gray-500">Loading products...</p>
    </div>
  );
}
