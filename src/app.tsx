import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./app/page";
import RootLayout from "./layout";
import Login from "@app/login";
import Register from "@app/register";
import OrderPage from "@app/customer/order";
import ProductDetail from "@app/customer/product/product_detail";
import CartPage from "@app/customer/cart";
import { Product } from "@src/types/Product";
import AccountPage from "@app/customer/account";
import { MainLayout } from "@layouts/main-layout/customer-layout";
import { AdminLayout } from "@layouts/admin-layout/admin-layout";
import AdminHome from "@app/admin/home";
import { OTPForm } from "@app/password/OTP";
import ProductManagementPage from "@app/admin/product/ProductList";

const items: Product[] = [];

function App() {
  const userRole: 'admin' | 'customer' = 'admin'; // Có thể thay đổi trong thực tế

  return (
    <RootLayout>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/password" element={<OTPForm />} />
          
          {/* Định nghĩa MainLayout và các route con */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage items={items} />} />

          </Route>
          <Route element={<AdminLayout />}>
            <Route path="/admin/" element={<AdminHome />} />
            <Route path="/admin/order" element={<ProductManagementPage/>} />
            <Route path="/admin/dilivery" element={<OrderPage />} />
            <Route path="/admin/product" element={<ProductManagementPage/>} />
            <Route path="/admin/product/:id" element={<ProductDetail />} />
            <Route path="/admin/storage" element={<CartPage items={items} />} />
          </Route>
          
        </Routes>
      </BrowserRouter>
    </RootLayout>
  );
}

export default App;
