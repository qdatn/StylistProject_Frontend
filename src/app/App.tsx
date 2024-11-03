import Footer from "@layouts/main-layout/footer";
import Header from "@layouts/main-layout/header";
import React, { useEffect, useState } from "react";
import ProductList from "./customer/product";

export default function Home() {
  // test connect fe & be
  // const [data, setData] = useState("");

  // const getData = async () => {
  //   const res = await axios.get("http://localhost:5000/");
  //   setData(res.data);
  // };

  // useEffect(() => {
  //   getData();
  // }, []);

  return (
    <>
      <Header />
      <ProductList />
      <Footer />
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
