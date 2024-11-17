// "use client";

// import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./index.css";
import CustomerHeader from "@layouts/main-layout/header";
import CustomerFooter from "@layouts/main-layout/footer";
import AdminHeader from "@layouts/admin-layout/header";
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
interface RootLayoutProps {
  children: React.ReactNode;
}

interface MainLayoutProps {
  
  userRole: 'admin' | 'customer';
}

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

