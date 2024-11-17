"use client";
import React, { useEffect, useState } from "react";
import ProductList from "./customer/product";

export default function HomePage() {
  return (
    <>
      <ProductList />
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
