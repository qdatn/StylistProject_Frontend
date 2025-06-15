import React, { useEffect, useState } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./app/page";
import RootLayout from "./layout";
import Login from "@app/login";
import Register from "@app/register";
import OrderPage from "@app/customer/order";
import ProductDetail from "@app/customer/product/product_detail";
import CartPage from "@app/customer/cart";
import AccountPage from "@app/customer/account";
import { MainLayout } from "@layouts/main-layout/customer-layout";
import { AdminLayout } from "@layouts/admin-layout/admin-layout";
import AdminHome from "@app/admin/home";
import { OTPForm } from "@app/password/OTP";
import StoragePage from "@app/admin/storage";
import Categories from "@app/admin/product/Categories";
import CustomerList from "@app/admin/customer";
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
import DashboardPage from "@app/admin/statistics";

import RequireAuth from "@components/auth/auth_require";
import ProductListAdminPage from "@app/admin/product/ProductList";
import ProductListPage from "@app/customer/product";
import NotFound from "@components/NotFound";
import ProductSearchPage from "@app/customer/product/product_search/ProductSearchPage";
import PaymentSuccessPage from "@app/customer/order/payment";
import ChatPage from "@app/admin/chat";
import EditCustomer from "@app/admin/customer/CustomerEdit";
import BodyShapePage from "@app/customer/body_shape";
import NotificationManagement from "@app/admin/customer/NotificationList";
import EditNotification from "@app/admin/customer/NotificationEdit";
import NewNotification from "@app/admin/customer/NewNotification";
import FashionSurveyPage from "@app/customer/survey";
import CustomerAnalytics from "@app/admin/customer/CustomerAnalytics";
import LoadingSpinner from "@components/loading";
function App() {
  const userRole: "admin" | "customer" = "admin"; // Có thể thay đổi trong thực tế
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập delay load dữ liệu
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <RootLayout>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotpassword" element={<ForgotPasswordForm />} />
          <Route path="/resetpassword" element={<ResetPasswordForm />} />
          <Route path="/OTP" element={<OTPForm />} />

          {/* Public layout - guest */}
          <Route element={<RequireAuth role="guest" />}>
            <Route path="/" element={<Home />} />
            <Route
              path="/product/search/query"
              element={<ProductSearchPage />}
            />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Protected layout - customer */}
          <Route element={<RequireAuth role="customer" />}>
            <Route path="/account" element={<AccountPage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/body-shape" element={<BodyShapePage />} />
            <Route path="/survey" element={<FashionSurveyPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Protected layout - admin */}
          <Route element={<RequireAuth role="admin" />}>
            <Route path="/admin/" element={<AdminHome />} />
            <Route path="/admin/storage" element={<StoragePage />} />
            <Route
              path="/admin/product/list"
              element={<ProductListAdminPage />}
            />
            <Route path="/admin/product/categories" element={<Categories />} />
            <Route path="admin/product/list/new" element={<NewProduct />} />
            <Route path="/admin/order" element={<OrderManagement />} />
            <Route path="/admin/discount" element={<DiscountManagement />} />
            <Route path="/admin/statistic" element={<DashboardPage />} />
            <Route path="/admin/customer/list" element={<CustomerList />} />
            <Route
              path="/admin/customer/list/edit/:id"
              element={<EditCustomer />}
            />
            <Route
              path="/admin/notification/list"
              element={<NotificationManagement />}
            />
            <Route
              path="/admin/notification/list/edit/:id"
              element={<EditNotification />}
            />
            <Route
              path="/admin/notification/list/new"
              element={<NewNotification />}
            />
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
            <Route path="/admin/discount/edit/:id" element={<EditDiscount />} />
            <Route
              path="/admin/product/categories/new"
              element={<NewCategory />}
            />
            <Route path="/admin/chat" element={<ChatPage />} />
            <Route path="/admin/order/new" element={<NewOrder />} />
            <Route path="/admin/discount/new" element={<NewDiscount />} />
            <Route path="/admin/analyze" element={<CustomerAnalytics />} />
            <Route path="/admin/*" element={<NotFound />} />
          </Route>

          {/* Public layout - guest */}
          <Route element={<MainLayout />}></Route>
          <Route element={<AdminLayout />}></Route>
        </Routes>
      </BrowserRouter>
    </RootLayout>
  );
}

export default App;
