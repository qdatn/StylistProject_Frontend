// "use client";

// import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./index.css";
import Header from "@layouts/main-layout/header";
import Footer from "@layouts/main-layout/footer";
import ScrollToTopButton from "@components/ScrollToTopButton";
import { Provider } from "react-redux";
import store from "@redux/store";
import { Auth0Provider } from "@auth0/auth0-react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Outlet } from "react-router-dom";
// import { ReactNode, useEffect } from "react";

// interface LayoutProps {
//   children: ReactNode;
// }

const domain = import.meta.env.REACT_APP_AUTH0_DOMAIN || "";
const clientId = import.meta.env.REACT_APP_AUTH0_CLIENT_ID || "";

const ggClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

// Rootlayout để có thể truyền layout khác vào {children}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri:
            typeof window !== "undefined" ? window.location.origin : "",
        }}
      >
        <GoogleOAuthProvider clientId={ggClientId}>
          <Provider store={store}>{children}</Provider>
        </GoogleOAuthProvider>
      </Auth0Provider>
    </>
  );
}

// Main Layout cho hầu như các page bao gôm header, footer và content
export function MainLayout() {
  return (
    <>
      {/* Header - Thay đổi header ở layouts/main-header/header */}
      <Header />

      {/* Nội dung return về ở page sẽ truyền vào children ở layout này */}
      <div className="mx-20">
        {/* Oulet is represent for child component */}
        <Outlet />
      </div>

      {/* Footer - Thay đổi footer ở layouts/main-footer/footer */}
      <Footer />

      {/* Button click to back to top page */}
      <ScrollToTopButton />
    </>
  );
}
