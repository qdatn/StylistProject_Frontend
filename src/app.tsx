// App.tsx
import React, { Children } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import Home from "./app/page";
import ProductList from "@app/customer/product";
import RootLayout, { MainLayout } from "./layout";
import Login from "@app/login";
import Register from "@app/register";
import Header from "@layouts/main-layout/header";
import OrderPage from "@app/customer/order";
import ProductDetail from "@app/customer/product/product_detail";
import CartPage from "@app/customer/cart";
import { Product } from "@src/types/Product";
// import Home from "./pages/Home";
// import About from "./pages/About";
// import NotFound from "./pages/NotFound";

const ggClientId = import.meta.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
const items: Product[] = [];

function App() {
  return (
    <RootLayout>
      <BrowserRouter>
        {/* <Layout> */}
        <Routes>
          <Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/product" element={<ProductList />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/product/:id" element={< ProductDetail/>} />
            <Route path="/cart" element={<CartPage items={items} />} />

          </Route>
        </Routes>
        {/* </Layout> */}
      </BrowserRouter>
    </RootLayout>
  );
}

export default App;