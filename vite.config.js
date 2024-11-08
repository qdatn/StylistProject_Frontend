import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Change this if you want to use a different port
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@app": path.resolve(__dirname, "./src/app"),
      "@contexts": path.resolve(__dirname, "./src/contexts"),
      "@models": path.resolve(__dirname, "./src/models"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@layouts": path.resolve(__dirname, "src/layouts"),
      "@libs": path.resolve(__dirname, "./src/lib"),
      "@middlewares": path.resolve(__dirname, "./src/middlewares"),
      "@public": path.resolve(__dirname, "./src/public"),
      "@redux": path.resolve(__dirname, "./src/redux"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@tests": path.resolve(__dirname, "./src/tests"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@components": path.resolve(__dirname, "src/components"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
});
