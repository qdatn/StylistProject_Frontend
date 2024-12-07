// Main Layout cho hầu như các page bao gôm header, footer và content

import CustomerHeader from "@layouts/main-layout/header";
import CustomerFooter from "@layouts/main-layout/footer";
import AdminHeader from "@layouts/admin-layout/header";
import ScrollToTopButton from "@components/ScrollToTopButton";
import { Provider } from "react-redux";
import store from "@redux/store";
import { Auth0Provider } from "@auth0/auth0-react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Outlet } from "react-router-dom";
export function MainLayout() {
  return (
    <div className="min-w-[760px] overflow-x-auto flex justify-center bg-gray-100">
      <div className="w-full max-w-[1510px] bg-white">
        {/* Header */}
        <CustomerHeader />

        {/* Nội dung con */}
        <div className="mx-auto px-8">
          <Outlet />
        </div>

        {/* Footer */}
        <CustomerFooter />

        {/* Back to Top */}
        <ScrollToTopButton />
      </div>
    </div>
  );
}