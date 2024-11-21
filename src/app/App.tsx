"use client";
import React, { useEffect, useState } from "react";
import ProductListPage from "./customer/product";
import Slider from "@app/slider";
import Banner from "./banner";

export default function HomePage() {
  return (
    <>
      <Slider />
      <ProductListPage />
      <Banner />
    </>
  );
}
// import { useAuth0 } from "@auth0/auth0-react";
// const { loginWithRedirect, logout, user, isAuthenticated, isLoading } =
//   useAuth0();

// export default function App() {
//   if (isLoading) {
//     return <div>Loading...</div>;
//   }
//   return <div></div>;
// }
