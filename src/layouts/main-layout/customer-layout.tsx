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
    <><div className="w-[1510px]">

      {/* Header - Thay đổi header ở layouts/main-header/header */}
      <CustomerHeader />

      {/* Nội dung return về ở page sẽ truyền vào children ở layout này */}
      <div className="mx-20">
        {/* Outlet sẽ render các page con */}
        <Outlet />
      </div>

      {/* Footer - Thay đổi footer ở layouts/main-footer/footer */}
      <CustomerFooter />

      {/* Button click to back to top page */}
      <ScrollToTopButton />
    </div>
    </>
  );
}