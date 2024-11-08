// App.tsx

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '@app/login';
import Home from '@app/page';
import RootLayout, { MainLayout } from './layout';
import Register from '@app/register';

import "./index.css";

import { Provider } from "react-redux";
import store from "@redux/store";
import { Auth0Provider } from "@auth0/auth0-react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
// import { ReactNode, useEffect } from "react";

// interface LayoutProps {
//   children: ReactNode;
// }

const domain = import.meta.env.REACT_APP_AUTH0_DOMAIN || "";
const clientId = import.meta.env.REACT_APP_AUTH0_CLIENT_ID || "";

const ggClientId = import.meta.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";


function App() {
  return (
    // <Auth0Provider
    //   domain={domain}
    //   clientId={clientId}
    //   authorizationParams={{
    //     redirect_uri:
    //       typeof window !== "undefined" ? window.location.origin : "",
    //   }}
    // >
    //   <GoogleOAuthProvider clientId={ggClientId}>
    //     <Provider store={store}>
          <BrowserRouter>
            <Routes>
              <Route>
                <Route path="/login" element={<Login />} />
                <Route path="/reigster" element={<Register />} />
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                </Route>
              </Route>

            </Routes>

          </BrowserRouter>

    //     </Provider>
    //   </GoogleOAuthProvider>
    // </Auth0Provider>

  );
}

export default App;