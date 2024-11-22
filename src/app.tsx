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
import StoragePage from "@app/admin/storage";
import Categories from "@app/admin/product/Categories";
import CustomerList from "@app/admin/customer/CustomerList";
import OrderManagement from "@app/admin/order";
import ForgotPasswordForm from "@app/password/ForgotPasswordForm";
import ResetPasswordForm from "@app/password/ResetPasswordForm";
import NewProduct from "@app/admin/product/NewProduct";
import EditProduct from "@app/admin/product/ProductEdit";
import EditProductStorage from "@app/admin/storage/ProductEdit";
import NewCategory from "@app/admin/product/NewCategories";
import EditCategory from "@app/admin/product/CategoriesEdit";
import NewOrder from "@app/admin/order/OrderNew";
import EditOrder from "@app/admin/order/OrderEdit";
import DiscountManagement from "@app/admin/discount";
import NewDiscount from "@app/admin/discount/NewDiscount";
import EditDiscount from "@app/admin/discount/DiscountEdit";
import ProductList from "@app/admin/product/ProductList";


function App() {
  const userRole: "admin" | "customer" = "admin"; // Có thể thay đổi trong thực tế

  return (
    <RootLayout>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/OTP" element={<OTPForm />} />
          <Route path="/forgotpassword" element={<ForgotPasswordForm />} />
          <Route path="/resetpassword" element={<ResetPasswordForm />} />

          {/* Định nghĩa MainLayout và các route con */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
          </Route>
          <Route element={<AdminLayout />}>
            <Route path="/admin/" element={<AdminHome />} />
            <Route path="/admin/storage" element={<StoragePage />} />
            <Route path="/admin/product/list" element={<ProductList />} />
            <Route path="/admin/product/categories" element={<Categories />} />
            <Route path="admin/product/list/new" element={<NewProduct />} />
            <Route path="/admin/order" element={<OrderManagement />} />
            <Route path="/admin/discount" element={<DiscountManagement />} />
            <Route path="/admin/customer" element={<CustomerList />} />
            <Route
              path="/admin/product/list/edit/:id"
              element={<EditProduct />}
            />
            <Route
              path="/admin/storage/edit/:id"
              element={<EditProductStorage />}
            />
            <Route
              path="/admin/product/categories/edit/:id"
              element={<EditCategory />}
            />
            <Route path="/admin/order/edit/:id" element={<EditOrder />} />
            <Route
              path="/admin/product/categories/new"
              element={<NewCategory />}
            />
            <Route
              path="/admin/discount/edit/:id"
              element={<EditDiscount />}
            />
            <Route path="/admin/product/categories/new" element={<NewCategory />} />
            <Route path="/admin/order/new" element={<NewOrder/>} />
            <Route path="/admin/discount/new" element={<NewDiscount/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </RootLayout>
  );
}

export default App;
