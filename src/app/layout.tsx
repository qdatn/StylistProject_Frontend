"use client";

// import type { Metadata } from "next";
import "./globals.css";
import Header from "@layouts/main-layout/header";
import Footer from "@layouts/main-layout/footer";
import ScrollToTopButton from "@components/ScrollToTopButton";
import { Provider } from "react-redux";
import store from "@redux/store";
import { Auth0Provider } from "@auth0/auth0-react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Outlet } from "react-router-dom";
// import { useEffect } from "react";

const domain = process.env.REACT_APP_AUTH0_DOMAIN || "";
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID || "";

const ggClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

// const geistInter = localFont({
//   src: "./fonts/Inter.woff",
//   variable: "--font-geist-inter",
//   weight: "100 900",
// });

// export const metadata: Metadata = {
//   title: "Stylist",
//   description: "Stylist and Ecommerce website",
// };

// Rootlayout để có thể truyền layout khác vào {children}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri:
          typeof window !== "undefined" ? window.location.origin : "",
      }}
    >
      <GoogleOAuthProvider clientId={ggClientId}>
        <Provider store={store}>
          <html lang="en">
            <body
            // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            // className={`${geistInter.variable} antialiased`}
            >
              {children}
            </body>
          </html>
        </Provider>
      </GoogleOAuthProvider>
    </Auth0Provider>
  );
}

// Main Layout cho hầu như các page bao gôm header, footer và content
export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Style</title>
        <link
          rel="shortcut icon"
          href="/favicon.ico"
          type="image/x-icon"
        ></link>
      </head>
      <body
      //  className={`${geistInter.variable} antialiased`}
      >
        {/* Header - Thay đổi header ở layouts/main-header/header */}
        <Header />

        {/* Nội dung return về ở page sẽ truyền vào children ở layout này */}
        <div className="mx-20">
          <Outlet />
        </div>

        {/* Footer - Thay đổi footer ở layouts/main-footer/footer */}
        <Footer />

        {/* Button click to back to top page */}
        <ScrollToTopButton />
      </body>
    </html>
  );
}
